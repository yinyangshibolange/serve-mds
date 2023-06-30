const http = require('http')
const server = http.createServer()
const path = require("path")
const logger = require("./logger")
const chalk = require('chalk')
const ejs = require('ejs')
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

function replaceTitle (html, title) {
  const title_match = html.match(/<title>([\s\S]*)<\/title>/)
  if (!title_match) {
    const head_match = html.match(/<head>([\s\S]*)<\/head>/)
    if (!head_match) {
      const html_match = html.match(/<html>([\s\S]*)<\/html>/)
      if (html_match) return html.replace(head_match[0], `<html><head><title>${title}</title></head>${head_match[1]}</html>`)
      return `<html><head><title>${title}</title></head>${html}</html>`
    } else {
      return html.replace(head_match[0], `<head>${head_match[1]}<title>${title}</title></head>`)
    }
  } else {
    return html.replace(title_match[0], `<title>${title}</title>`)
  }
}

function replaceMeta (html, meta) {
  const head_match = html.match(/<head>([\s\S]*)<\/head>/)
  if (!head_match) {
    const html_match = html.match(/<html>([\s\S]*)<\/html>/)
    if (html_match) return html.replace(head_match[0], `<html><head>${meta}</head>${head_match[1]}</html>`)
    return `<html><head>${meta}</head>${html}</html>`
  } else {
    return html.replace(head_match[0], `<head>${head_match[1]}${meta}</head>`)
  }
}

function replaceBody (html, content, istop) {
  const body_match = html.match(/<body>([\s\S]*)<\/body>/)
  if (body_match) {
    if (istop) {
      return html.replace(body_match[0], `<body>${content}${body_match[1]}</body>`)
    } else {
      return html.replace(body_match[0], `<body>${body_match[1]}${content}</body>`)
    }
  } else {
    if (istop) {
      return content + html
    } else {
      return html + content
    }
  }
}

module.exports = async function (config) {
  const { openDefaultBrowser } = require("./useUtils")(config)

  const { getMdStrByUrl, getMdStrByQuery, getMarkdownHtml } = require("./useMdLoad")(config)
  const { getQueryString, getNextExpire, readStaticFiles, readHtmlFiles } = require("./useUtils")(config)
  const { passwords, getPassordMd, validate_password, } = require("./usePass")(config)
  const { getHeaders,
    getFooter, getMdInfos, getTypeModule, getTagModule,getTimeLineModule,getMdList
  } = require("./htmlGengor")(config)

  let config_indexs = []
  const htmls = config.htmls || []
  htmls.forEach(item => {
    if (Array.isArray(item.index)) {
      config_indexs = [...config_indexs, ...item.index]
    } else if (typeof item.index === 'string') {
      config_indexs.push(item.index)
    }
  })

  const md_path = path.resolve(process.cwd(), config.mds_dir || "mds")
  const mdInfos = await getMdInfos(md_path)
  console.log(mdInfos)

  // 更具md_infos 获取 types 模块和 tags模块
  const { type_module_html, types } = getTypeModule(mdInfos)
  const { tags_module_html, tags, } = getTagModule(mdInfos)

  const {timeline,timeline_module_html} = getTimeLineModule(mdInfos)
  const {mds} = getMdList(mdInfos)



  const content_dom = '<div id="slot-content" style="display: none;"></div>'

  function replaceHtml (html_string, html) {
    const { showHeader, showFooter, showType, showTag } = html
    let tempstr = html_string
    tempstr = replaceBody(tempstr, content_dom, false)

    if (showFooter) {
      tempstr = replaceBody(tempstr, getFooter(), false)
    }
    if (showType) {
      tempstr = replaceBody(tempstr,
        `
        <section id="typeModule" class="type-module module">
   <div class="title">分类</div>
${type_module_html}
   </section>
        `
        , true)
    }
    if (showTag) {
      tempstr = replaceBody(tempstr, `
      <section id="tagModule" class="tag-module module">
 <div class="title">标签</div>
${tags_module_html}
 </section>
      `, true)
    }
    if (showHeader) {
      tempstr = replaceBody(tempstr, getHeaders(), true)
    }
    // console.log(tempstr)
    const body_match = tempstr.match(/<body>([\s\S]*)<\/body>/)
    if (body_match) {
      // console.log(',,,,,,,,,,',body_match[0],body_match[1])
      tempstr = tempstr.replace(body_match[0], `<div id="app">${body_match[1]}</div>`)
    }

    return tempstr
  }

  server.on('request', function (request, response) {
    const url = request.url
    const url_index = url.replace(/\?.*/, "")

    // console.log(url_index, url, htmls,config_indexs)

    // markdown_html = replaceBody(markdown_html, getHeaders(), true)
    //         markdown_html= replaceBody(markdown_html, getFooter(), false)


    let md_html = config.htmls.find(item => item.content === 'md')

    // apis
    if (url_index.startsWith("/pass") && config.need_password) { // 密码验证逻辑
      const password = getQueryString("password", url)
      if (passwords.includes(password)) {
        response.setHeader('Set-Cookie', ['pass=' + getPassordMd(password), getNextExpire(), 'HttpOnly']); // ⑤
        response.setHeader('Cache-Control', 'no-cache'); // ⑤
        response.writeHead(301, { 'Location': '/' });
      } else {
        response.writeHead(301, { 'Location': (config.password_index || "/auth") + '?pass=error' });
      }
      response.end()
      // html
    } else if (url_index.startsWith("/api/mdinfos")) {
      response.setHeader("Content-Type", "application/json")
      response.end(JSON.stringify({
        code: 0,
        data: mdInfos
      }))
    } else if (url_index.startsWith("/api/types")) {
      response.setHeader("Content-Type", "application/json")
      response.end(JSON.stringify({
        code: 0,
        data: types
      }))
    } else if (url_index.startsWith("/api/tags")) {
      response.setHeader("Content-Type", "application/json")
      response.end(JSON.stringify({
        code: 0,
        data: tags
      }))
    }else if (url_index.startsWith("/api/timeline")) {
      response.setHeader("Content-Type", "application/json")
      response.end(JSON.stringify({
        code: 0,
        data: timeline
      }))
    }else if (url_index.startsWith("/api/mdlist")) {
      response.setHeader("Content-Type", "application/json")
      response.end(JSON.stringify({
        code: 0,
        data: mds
      }))
    } else if (url_index.startsWith('/mds-') || (md_html.index === url_index || md_html.index.includes(url_index))) { // markdown资源路径
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Content-Type', 'text/html;charset=utf8');
      function getMdHtml (url) {
        let markdown_html
        if (url_index.startsWith('/mds-')) {
          markdown_html = getMarkdownHtml(getMdStrByUrl(url))
        } else {
          const md = getQueryString("md", url)
          markdown_html = getMarkdownHtml(getMdStrByQuery(md))
        }
        if (markdown_html && md_html) {
          let html_string = readHtmlFiles(md_html.path)
          html_string = replaceHtml(html_string, md_html)
          return html_string.replace(content_dom, markdown_html)
        } else {
          return ""
        }
      }
      if (config.need_password) {
        // 验证cookie中的密码
        if (validate_password(request.headers.cookie)) {
          // 成功返回内容
          let markdown_html = getMdHtml(url)
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
        let markdown_html = getMdHtml(url)
        if (markdown_html) {
          response.end(markdown_html)
        } else {
          response.writeHead(404);
          response.end('404 Not Found');
        }
      }
      // html
    } else if (config_indexs.includes(url_index)) { // 登录页面渲染
      response.setHeader('Content-Type', 'text/html;charset=utf8');
      let html;
      htmls.forEach(item => {
        if (item.index === url_index || (Array.isArray(item.index) && item.index.includes(url_index))) {
          html = item
        }
      })
      let html_string = readHtmlFiles(html.path)
      if (html.title) {
        html_string = replaceTitle(html_string, html.title)
      }
      if (html.meta) {
        html_string = replaceMeta(html_string, html.meta)
      }



      html_string = replaceHtml(html_string, html)
      if (html.content) {
        if (html.content === 'types') {
          function getTypeEjs () { }
          const type_ejs = `
          <ul>
          <% users.forEach(function(user){ %>
            <%- include('user/show', {user: user}); %>
          <% }); %>
          </ul>
          `
          html_string = html_string.replace(content_dom, type_module_html)
        }
        if (html.content === 'tags') {
          html_string = html_string.replace(content_dom, tags_module_html)
        }

        if(html.content === 'timeline') {
          html_string = html_string.replace(content_dom, timeline_module_html)
        }
      }
      response.end(html_string)
    } else { // 静态资源加载
      readStaticFiles(request, response)
    }
  })

  server.listen(config.app_port, function () {
    logger.log(`本机运行地址：${chalk.blue(`http://127.0.0.1:${config.app_port}`)}`)
    logger.log(`局域网运行地址：${chalk.blue(`http://${netip}:${config.app_port}`)}`)
    if (config.debug) {
      openDefaultBrowser(`http://127.0.0.1:${config.app_port}`)
    }
  })
}
