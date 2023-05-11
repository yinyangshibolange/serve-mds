const fs = require("fs")
const { marked } = require("marked")
const path = require("path")
const config = require("../userspace/config")

function getMdStrByUrl (url) {
 let filepath
 if (url === '/') {
  filepath = path.resolve(__dirname, '../userspace', config.mds_dir, config.index_md.endsWith('.md') ? config.index_md : config.index_md + '.md')
 } else if (url.startsWith('/mds-')) {
  const matchReg = /\/mds-([^\/\?]*).*/
  const m = url.match(matchReg)
  console.log(m)
  const match_path = m[1].split("--").join('/')
  filepath = path.resolve(__dirname, '../userspace', config.mds_dir, match_path.endsWith('.md') ? match_path : match_path + '.md')
 }
 try {
  return fs.readFileSync(filepath).toString()
 } catch (err) {
  return ""
 }

}

function getMarkdownHtml (str) {
 if (!str) return
 // head
 const html_head = `<head>
 <meta charset='utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0, user-scalable=0" />
<link rel="stylesheet" type="text/css" href="${config.markdown_theme}.css">
 <link rel="stylesheet" type="text/css" href="common.css">
</head>
 `

 // markdown
 const markdown_container = `<div id="markdown_container">
 ${marked(str)}
 </div>`

 // menu
 const menustr = require("./gengorMenu")(markdown_container, config.max_levels) // 生成菜单

 // scripts
 const scripts = '<script src="doc.js"></script>' // 加入js脚本

 const html_body = `<body><div id="main">${menustr + markdown_container}</div>${scripts}</body>`
 // 写入拼接内容

 return html_head + html_body
}

module.exports = {
 getMdStrByUrl,
 getMarkdownHtml,
}