const http = require('http')
const server = http.createServer()
const path = require("path")
const logger = require("./logger")
const chalk = require('chalk')
const ejs = require('ejs')
const urlencode = require('urlencode');
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


module.exports = async function (config) {
  require("./csass")(config) // sass 编译
  const { openDefaultBrowser, replaceHeader,
    replaceBody,
    replaceMeta,
    replaceTitle } = require("./useUtils")(config)

  const { getMdStrByUrl, getMdStrByQuery, getMarkdownHtml } = require("./useMdLoad")(config)
  const { getQueryString, getNextExpire, readStaticFiles, readEjs } = require("./useUtils")(config)
  const { passwords, getPassordMd, validate_password, } = require("./usePass")(config)
  const { getHeaders,
    getFooter, getMdInfo, getMdInfos, getTypeModule, getTagModule, getTimeLineModule, getMdList
  } = require("./htmlGengor")(config)
  const { renderEjs } = require("./ejsRender")(config)
  const { addComment, deleteComment, getComments } = require("./comment")(config)

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

  // 更具md_infos 获取 types 模块和 tags模块
  const {type_module_html, types } = getTypeModule(mdInfos)
  const { tags_module_html, tags, } = getTagModule(mdInfos)

  const { timeline, timeline_module_html } = getTimeLineModule(mdInfos)
  const mds = getMdList(mdInfos)

  const content_dom = '<div id="slot-content" style="display: none;"></div>'

 /* ------------------------------------      通用html拼接方法      ------------------------------------------------------ */
  function replaceHtml (html_string, html) {
    const { showHeader, showFooter } = html
    let tempstr = html_string
    const match_body = tempstr.match(/<body>([\s\S]*)<\/body>/)
    if(match_body) {
      tempstr=tempstr.replace(match_body[0], match_body[0].replace(match_body[1], `<section id="container">${match_body[1]}</section>`))
    }
    if(Array.isArray(config.base_csss) && config.base_csss.length > 0) {
      tempstr = replaceHeader(tempstr, config.base_csss.map(item => {
        return `<link rel="stylesheet" type="text/css" href="${item}">`
      }).join('\r\n'))
    }
    if(Array.isArray(config.base_jss) && config.base_jss.length > 0) {
      tempstr = replaceHeader(tempstr, config.base_jss.map(item => {
        return `<script  type="text/javascript" src="${item}"></script>`
      }).join('\r\n'))
    }
    if(Array.isArray(config.heads) && config.heads.length > 0) {
      tempstr = replaceHeader(tempstr, config.heads.join('\r\n'))
    }
    if (showHeader) {
      tempstr = replaceBody(tempstr, getHeaders(html), true)
      tempstr = replaceHeader(tempstr, `<link rel="stylesheet" type="text/css" href="css/header.css">`)
    }
    if (showFooter) {
      tempstr = replaceBody(tempstr, getFooter(html), false)
      tempstr = replaceHeader(tempstr, `<link rel="stylesheet" type="text/css" href="css/footer.css">`)
    }

    const body_match = tempstr.match(/<body>([\s\S]*)<\/body>/)
    if (body_match) {
      tempstr = tempstr.replace(body_match[0], `<div id="app">${body_match[1]}</div>`)
    }
    return tempstr
  }

  server.on('request', function (request, response) {
    let url = request.url
    const url_index = url.replace(/\?.*/, "")

    let md_html = config.htmls.find(item => item.content === 'md')

    // apis
    if (url_index.startsWith("/pass") && config.need_password) { // 密码验证逻辑
      const password = getQueryString("password", url)
      if (passwords.includes(password)) {
        response.setHeader('Set-Cookie', ['pass=' + getPassordMd(password), getNextExpire(), 'HttpOnly']); // ⑤
        response.setHeader('Cache-Control', 'max-age=10'); // ⑤
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
    } else if (url_index.startsWith("/api/timeline")) {
      response.setHeader("Content-Type", "application/json")
      response.end(JSON.stringify({
        code: 0,
        data: timeline
      }))
    } else if (url_index.startsWith("/api/mdlist")) {
      response.setHeader("Content-Type", "application/json")
      response.end(JSON.stringify({
        code: 0,
        data: mds
      }))
    } else if (url_index.startsWith("/api/comment/add")) {
      response.setHeader("Content-Type", "application/json")
      console.log(request.method === 'post', request)
      // addComment(aindex, parentid, content, user)
      response.end(JSON.stringify({
        code: 0,
        data: null,
        msg: "添加成功"
      }))
    } else if (url_index.startsWith("/api/comment/getAll")) {
      response.setHeader("Content-Type", "application/json")
      response.end(JSON.stringify({
        code: 0,
        data: getComments(getQueryString("aindex", url))
      }))
    } else if (url_index.startsWith('/mds-')) {
      let mdUrlIndex = Array.isArray(md_html.index) && md_html.index.length > 0 ? md_html.index[0] : md_html.index
      response.writeHead(301, { 'Location': mdUrlIndex + `?md=${url_index.substring(1)}` });
      response.end()
    } else if ((md_html.index === url_index || md_html.index.includes(url_index))) { // markdown资源路径
      url = urlencode.decode(url, 'utf8')
      response.setHeader('Cache-Control', 'max-age=10');
      response.setHeader('Content-Type', 'text/html;charset=utf8');
      function getMdHtml (url) {
        let markdown_html, mdstr;
        if (url_index.startsWith('/mds-')) {
          mdstr = getMdStrByUrl(url)
        } else {
          let md = getQueryString("md", url)
          mdstr = getMdStrByQuery(md)
        }
        const mdinfo = getMdInfo(mdstr)
        const match1 = mdstr.match(/(?<=(---))\s*\n([\s\S]*)\n\s*(?=(---))/)
        mdstr = mdstr.replace(`---${match1[0]}---`, "")
        markdown_html = getMarkdownHtml(mdstr)
        if (markdown_html && md_html) {
          let html_string = readEjs(md_html.path) // 获取容器html
          html_string = renderEjs(html_string, md_html, url_index, {
            types,
            tags,
            type_module_html:       type_module_html,
            tags_module_html: tags_module_html,
            mdMenuModuleHtml: markdown_html.menu,
            extraHeads: `
                <meta name="description" content="${mdinfo.desp}"/> 
                <meta name="keywords" content="${mdinfo.tag}"/> 
                ${markdown_html.head}
              `,
            markdownHtml: markdown_html.body
          })
          html_string = replaceHtml(html_string, md_html)
          return replaceTitle(html_string, mdinfo.title)
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
    } else if (config_indexs.includes(url_index)) { // 页面渲染
      url = urlencode.decode(url, 'utf8')
      response.setHeader('Content-Type', 'text/html;charset=utf8');
      let html;
      htmls.forEach(item => {
        if (item.index === url_index || (Array.isArray(item.index) && item.index.includes(url_index))) {
          html = item
        }
      })
      let html_string = readEjs(html.path)
      let renderData = {
        mds,
        types,
        tags,
        type_module_html:  type_module_html,
        tags_module_html: tags_module_html,
        timeline_module_html: timeline_module_html,
        timeline: timeline,
      }
      if(url_index.startsWith("/type-index")) {
        let type = getQueryString("type", url)
        renderData.type_mds = mds.filter(item => item.type === type)
        renderData.type = type
      }
      else if(url_index.startsWith("/tag-index")) {
        let tag = getQueryString("tag", url)
        renderData.tag_mds = mds.filter(item => item.tag.indexOf(tag) > -1)
        renderData.tag = tag
      }
      // ejs 渲染
      html_string = renderEjs(html_string, html, url_index, renderData )
      if (html.title) {
        html_string = replaceTitle(html_string, html.title)
      }
      if (html.meta) {
        html_string = replaceMeta(html_string, html.meta)
      }

      html_string = replaceHtml(html_string, html)

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
