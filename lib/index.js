const http = require('http')
const server = http.createServer()
const path = require("path")
const logger = require("./logger")
const chalk = require('chalk')

const os = require('os');
var interfaces = os.networkInterfaces();
var netip = ""
for (var devName in interfaces) {
  var iface = interfaces[devName];
  for (var i = 0; i < iface.length; i++) {
    var alias = iface[i];
    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
      netip = alias.address;
    }
  }
}

module.exports = function (config) {
  const {openDefaultBrowser} = require("./useUtils")(config)

  const { getMdStrByUrl, getMarkdownHtml, getHiHtml } = require("./useMdLoad")(config)
  const { getQueryString, getNextExpire, readStaticFiles } = require("./useUtils")(config)
  const { passwords, getPassordMd, validate_password, } = require("./usePass")(config)

  server.on('request', function (request, response) {
    const url = request.url
    if (url === '/' || url.startsWith('/mds-')) { // markdown资源路径
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Content-Type', 'text/html;charset=utf8');
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
        response.setHeader('Set-Cookie', ['pass=' + getPassordMd(password), getNextExpire(), 'HttpOnly']); // ⑤
        response.setHeader('Cache-Control', 'no-cache'); // ⑤
        response.writeHead(301, { 'Location': '/' });
      } else {
        response.writeHead(301, { 'Location': '/hi.html' });
      }
      response.end()
    } else if (url === '/hi.html' && config.need_password) { // 登录页面渲染
      response.setHeader('Content-Type', 'text/html;charset=utf8');
      response.end(getHiHtml())
    } else { // 静态资源加载
      readStaticFiles(request, response)
    }
  })

  server.listen(config.app_port, function () {
    logger.log(`本机运行地址：${chalk.blue(`http://127.0.0.1:${config.app_port}`)}`)
    logger.log(`局域网运行地址：${chalk.blue(`http://${netip}:${config.app_port}`)}`)
    if(config.debug) {
      openDefaultBrowser(`http://127.0.0.1:${config.app_port}`)
    }
  })
}
