const http = require('http')
const server = http.createServer()
const path = require("path")
const config = require("./userspace/config")
const { getQueryString,getNextExpire, renderTemplate, readStaticFiles } = require("./utils")
const { passwords, getPassordMd, validate_password, } = require("./utils/pass")
const { getMdStrByUrl, getMarkdownHtml, } = require("./utils/markdownload")


server.on('request', function (request, response) {
 const url = request.url
 if (url === '/' || url.startsWith('/mds-')) { // markdown资源路径
  response.setHeader('Cache-Control', 'no-cache');
  if (config.need_password) {
   // 验证cookie中的密码
   if (validate_password(request.headers.cookie)) {
    // 成功返回内容
    const markdown_html = getMarkdownHtml(getMdStrByUrl(url))
    if (markdown_html) {
     response.end(markdown_html)
    } else {
     response.writeHead(404);
     response.end('404 Not Found');
    }
   } else {
    // 失败
    response.writeHead(301, { 'Location': '/hi.html' });
    response.end()
   }
  } else {
   // 成功返回内容
   const markdown_html = getMarkdownHtml(getMdStrByUrl(url))
   if (markdown_html) {
    response.end(markdown_html)
   } else {
    response.writeHead(404);
    response.end('404 Not Found');
   }
  }
 } else if (url.startsWith("/pass") && config.need_password) { // 密码验证逻辑
  const password = getQueryString("password", url)
  if (passwords.includes(password)) {
   response.setHeader('Set-Cookie', ['pass=' + getPassordMd(password),  getNextExpire(),'HttpOnly']); // ⑤
   response.setHeader('Cache-Control', 'no-cache'); // ⑤
   response.writeHead(301, { 'Location': '/' });
  } else {
   response.writeHead(301, { 'Location': '/hi.html' });
  }
  response.end()
 } else if (url === '/hi.html' && config.need_password) { // 登录页面渲染
  response.end(renderTemplate(path.resolve(__dirname, "./hi.html"), config))
 } else { // 静态资源加载
  readStaticFiles(request, response)
 }
})

server.listen(config.app_port, function () {
 console.info(`http://127.0.0.1:${config.app_port}/`)
})
