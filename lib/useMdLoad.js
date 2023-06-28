const fs = require("fs")
const { marked } = require("marked")
const path = require("path")
const { gfmHeadingId } = require("marked-gfm-heading-id")
marked.use(gfmHeadingId({
  prefix: "h-md-",
}))

module.exports = function (config) {
  function getMdStrByUrl (url) {
    let filepath
    if (url === '/') {
      const config_index_md = config.index_md || 'index'
      filepath = path.resolve(process.cwd(), config.mds_dir || 'mds', config_index_md.endsWith('.md') ? config_index_md : config_index_md + '.md')
    } else if (url.startsWith('/mds-')) {
      const matchReg = /\/mds-([^\/\?]*).*/
      const m = url.match(matchReg)
      const match_path = m[1].split("--").join('/')
      filepath = path.resolve(process.cwd(), config.mds_dir || 'mds', match_path.endsWith('.md') ? match_path : match_path + '.md')
    }
    try {
      return fs.readFileSync(filepath, 'utf-8').toString()
    } catch (err) {
      return ""
    }

  }

  function getStaticCss (cssPath, defaultCss) {
    if (cssPath) {
      return cssPath.endsWith(".css") ? cssPath : cssPath + '.css'
    } else {
      return defaultCss.endsWith(".css") ? defaultCss : defaultCss + '.css'
    }
  }

  function getCustomClass (custom_css) {
    if (!custom_css) return ""
    if (Array.isArray(custom_css)) {
      return custom_css.map(item => {
        return `<link rel="stylesheet" type="text/css" href="${item.endsWith('.css') ? item : (item + '.css')}">`
      }).join("\n")
    } else if (typeof custom_css === 'string') {
      return `<link rel="stylesheet" type="text/css" href="${custom_css.endsWith('.css') ? custom_css : (custom_css + '.css')}">`
    } else {
      return ""
    }
  }

  function getCustomJs (custom_js) {
    if (!custom_js) return ""
    if (Array.isArray(custom_js)) {
      return custom_js.map(item => {
        return `<script src="${item.endsWith('.js') ? item : (item + '.js')}"></script>`
      }).join('\n')
    } else if (typeof custom_js === 'string') {
      return `<script src="${custom_js.endsWith('.js') ? custom_js : (custom_js + '.js')}"></script>`
    } else {
      return ""
    }
  }

  function getMarkdownHtml (str) {
    if (!str) return


    // markdown
    const markdown_container = `<div id="markdown_container">
  ${marked(str, { mangle: false, headerIds: false, })}
  </div>`
    // menu
    const { menu, content, first_title } = require("./gengorMenu")(markdown_container, config.max_levels) // 生成菜单

    // head
    const html_head = `<head>
     <meta charset='utf-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0, user-scalable=0" />
    <link rel="stylesheet" type="text/css" href="${getStaticCss(config.markdown_theme, 'themes/github-markdown.css')}">
     <link rel="stylesheet" type="text/css" href="common.css">
     ${getCustomClass(config.custom_css)}
     <link rel="stylesheet" type="text/css" href="${getStaticCss(config.highlight_theme, 'highlight/styles/default.min.css')}">
     <script src="highlight/highlight.min.js"></script>
     <title>${config.app_name}${first_title ? ('-' + first_title) : ''}</title>
     <link rel="shortcut icon" href="${config.favicon}">
    </head>
     `

    // scripts
    const scripts = `
  <script src="doc.js"></script>
  <script>
  hljs.highlightAll();
</script>
${getCustomJs(config.custom_js)}
  ` // 加入js脚本

    const html_body = `<body><div id="main" class="markdown-body">${menu + content}</div>${scripts}</body>`
    // 写入拼接内容

    return html_head + html_body
  }

  return {
    getMdStrByUrl,
    getMarkdownHtml,
  }
}

