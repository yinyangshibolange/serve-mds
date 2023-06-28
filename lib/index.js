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

function replaceTitle(html, title) {
  const title_match = html.match(/<title>(.*)<\/title>/)
  if(!title_match) {
    const head_match = html.match(/<head>(.*)<\/head>/)
    if(!head_match) {
      const html_match = html.match(/<html>(.*)<\/html>/)
      if(html_match)  return html.replace(head_match[0], `<html><head><title>${title}</title></head>${head_match[1]}</html>` )
      return `<html><head><title>${title}</title></head>${html}</html>`
    } else {
      return html.replace(head_match[0],  `<head>${head_match[1]}<title>${title}</title></head>`)
    }
  } else {
    return html.replace(title_match[0], `<title>${title}</title>`)
  }
}

function replaceMeta(html, meta) {
  const head_match = html.match(/<head>(.*)<\/head>/)
  if(!head_match) {
    const html_match = html.match(/<html>(.*)<\/html>/)
    if(html_match)  return html.replace(head_match[0], `<html><head>${meta}</head>${head_match[1]}</html>`  )
    return   `<html><head>${meta}</head>${html}</html>`
  } else {
    return html.replace(head_match[0], `<head>${head_match[1]}${meta}</head>`)
  }
}

module.exports = function (config) {
  const {openDefaultBrowser} = require("./useUtils")(config)

  const { getMdStrByUrl, getMarkdownHtml } = require("./useMdLoad")(config)
  const { getQueryString, getNextExpire, readStaticFiles, readHtmlFiles } = require("./useUtils")(config)
  const { passwords, getPassordMd, validate_password, } = require("./usePass")(config)

  let config_indexs = []
  const htmls = config.htmls || []
  htmls.forEach(item => {
    if(Array.isArray(item.index)) {
      config_indexs = [...config_indexs, ...item.index]
    } else if(typeof item.index === 'string') {
      config_indexs.push(item.index)
    }
  })
  server.on('request', function (request, response) {
    const url = request.url
    const url_index = url.replace(/\?.*/, "")

    // console.log(url_index, url, htmls,config_indexs)

    if (url_index.startsWith('/mds-')) { // markdown资源路径
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
          response.writeHead(301, { 'Location': config.password_index || "/auth" });
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
    } else if (url_index.startsWith("/pass") && config.need_password) { // 密码验证逻辑
      const password = getQueryString("password", url)
      if (passwords.includes(password)) {
        response.setHeader('Set-Cookie', ['pass=' + getPassordMd(password), getNextExpire(), 'HttpOnly']); // ⑤
        response.setHeader('Cache-Control', 'no-cache'); // ⑤
        response.writeHead(301, { 'Location': '/' });
      } else {
        response.writeHead(301, { 'Location': (config.password_index || "/auth")  + '?pass=error' });
      }
      response.end()
    } else if (config_indexs.includes(url_index)) { // 登录页面渲染
      response.setHeader('Content-Type', 'text/html;charset=utf8');
      let html;
      htmls.forEach(item => {
        if(item.index === url_index || (Array.isArray(item.index) && item.index.includes(url_index))) {
          html = item
        }
      })
      let html_string = readHtmlFiles(html.path)
      if(html.title) {
        html_string = replaceTitle(html_string, html.title)
      }
      if(html.meta) {
        html_string = replaceMeta(html_string, html.meta)
      }
      response.end(html_string)
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
