const fs = require("fs")
const { marked } = require("marked")
const path = require("path")
const { gfmHeadingId } = require("marked-gfm-heading-id")
marked.use(gfmHeadingId({
 prefix: "h-md-",
}))

function isFileExist (filepath) {
 return new Promise((resolve, reject) => {
  fs.stat(filepath, function (err, stats) {
   if (!err && stats.isFile()) {
    resolve(stats)
   } else {
    reject(err)
   }
  })
 })
}

async function fileExists (fileDirs, filename, type, searchMin) {
 const filepaths = []
 fileDirs.forEach(item => {
  filepaths.push(path.resolve(item, filename + '.' + type))
  if(searchMin) filepaths.push(path.resolve(item, filename + '.min.' + type))
 })

 let flag = false
 for (let i = 0; i < filepaths.length; i++) {
  try {
   await isFileExist(filepaths[i])
   flag = true
   break
  } catch (err) {
   flag = false
  }
 }
 return flag
}

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

 function getStaticCss(cssPath, defaultCss) {
  if(cssPath) {
   return cssPath.endsWith(".css") ? cssPath : cssPath + '.css'
  } else {
   return defaultCss.endsWith(".css") ? defaultCss : defaultCss + '.css'
  }
 }

 function getMarkdownHtml (str) {
  if (!str) return
  // head
  const html_head = `<head>
  <meta charset='utf-8'>
 <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0, user-scalable=0" />
 <link rel="stylesheet" type="text/css" href="${getStaticCss(config.markdown_theme, 'themes/github-markdown.css')}">
  <link rel="stylesheet" type="text/css" href="common.css">
  <link rel="stylesheet" type="text/css" href="${getStaticCss(config.highlight_theme, 'highlight/styles/default.min.css')}">
  <script src="highlight/highlight.min.js"></script>
 </head>
  `

  // markdown
  const markdown_container = `<div id="markdown_container">
  ${marked(str, { mangle: false, headerIds: false, })}
  </div>`
  // menu
  const { menu, content } = require("./gengorMenu")(markdown_container, config.max_levels) // 生成菜单

  // scripts
  const scripts = `
  <script src="doc.js"></script>
  <script>
  hljs.highlightAll();
</script>
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

