//使用Node搭建一个简单的http服务器
//加载http模块
const http = require('http')
const fs = require("fs")
const { marked } = require("marked")
const path = require("path")
//调用http的createServer方法 创建一个服务器实例
const server = http.createServer()
const zlib = require("zlib")
const mime = require("mime")
const crypto = require("crypto")
const readline = require('readline');
const events = require('events');
const md5 = require("md5")

Date.prototype.Format = function (fmt) {
 var o = {
  "M+": this.getMonth() + 1, //月份
  "d+": this.getDate(), //日
  "H+": this.getHours(), //小时
  "m+": this.getMinutes(), //分
  "s+": this.getSeconds(), //秒
  "q+": Math.floor((this.getMonth() + 3) / 3), //季度
  "S": this.getMilliseconds() //毫秒
 };
 if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
 for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
 return fmt;
}

function getQueryString (name, url = window.location.href) {
 if (!url || !name) return null
 var reg = new RegExp("([\?&])" + name + "=([^&]*)(&|$)", "i");
 var r = url.match(reg);
 if (r != null) return unescape(r[2]);
 return null;
}

function gzipFile (req, res) {
 const acceptEncoding = req.headers['accept-encoding']; // 获取文件支持的压缩格式
 if (acceptEncoding) {
  if (acceptEncoding.includes('gzip')) {
   res.setHeader('Content-Encoding', 'gzip');
   return zlib.createGzip();  // 返回gzip压缩流
  } else if (acceptEncoding.includes('deflate')) {
   res.setHeader('Content-Encoding', 'deflate');
   return zlib.createDeflate();  // 返回deflate压缩流
  }
 }
 return false; // 如果不支持就返回false
}

function cacheFile (req, res, filePath, fileStat) {
 res.setHeader('Cache-Control', 'max-age=10'); // 设定强制缓存，时间为10秒
 const lastModifyed = fileStat.ctime.toGMTString(); // 获取文件最后修改时间
 const etag = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('base64'); // 将文件内容时间摘要(通常不会对整个文件进行摘要，因为内容太多影响性能，一般选择其中一部分，由于这里只是学习使用，就不用考虑太多！)
 res.setHeader('Last-Modified', lastModifyed); // 设定最后修改时间的响应头
 res.setHeader('Etag', etag); // 设置Etag响应头
 const ifModifiedSince = req.headers['if-modified-since']; // 获取上一次修改时间
 const ifNoneMatch = req.headers['if-none-match']; // 与Etag搭配使用的请求头，对比Etag值，如果相同则表示文件没变化，可走缓存，否则重新加载
 if (ifModifiedSince !== lastModifyed) { // 判断文件的最后修改时间和请求头里最后的修改时间是否相同
  return false;
 }
 if (etag !== ifNoneMatch) { // 判断 Etag和ifNoneMatch值是否相同
  return false;
 }
 return true;
}

function readStaticFiles (request, response) {
 if (!request.url.startsWith("/")) {
  // 发送404响应:
  response.writeHead(416);
  response.end('416 页面无法提供请求的范围。');
  return
 }
 const filepath = path.resolve(__dirname, "./static", "." + request.url)

 fs.stat(filepath, function (err, stats) {
  if (!err && stats.isFile()) {
   if (cacheFile(request, response, filepath, stats)) { // 如果文件符合缓存策略就使用缓存，返回状态码304
    response.statusCode = 304;
    response.end();
   } else {
    response.setHeader('Content-Type', mime.getType(filepath) + ';charset=utf-8'); // 用mime模块为不同文件类型设置对应的响应头
    let createCompress; // 定义压缩流
    if (createCompress = gzipFile(request, response)) {  // 如果文件符合压缩策略就创建压缩流
     fs.createReadStream(filepath).pipe(createCompress).pipe(response);  // 以流管道的形式将文件模板压缩后再输出到页面显示
    } else {
     fs.createReadStream(filepath).pipe(response);  // 以流管道的形式将文件模板输出到页面显示
    }
   }

   // 这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里↑↑这里
  } else {
   // 发送404响应:
   response.writeHead(404);
   response.end('404 Not Found');
  }
 });
}

function gengorMenu (md_html) {
 const matchs_arr = [...md_html.matchAll(/<h([1-6])\sid=\"(.*)\">([^<>]+)<\/h[1-6]>/g)]
 const menuList = []
 matchs_arr.forEach(item => {
  menuList.push({
   target_id: item[2],
   name: item[3],
   level: +item[1],
  })
 })
 const menuListTree = deelMenuList(menuList)
 return `<div id="menu_tree" class="menu_tree">${genTreeUl(menuListTree, true)}
 <a id="fold_img" class="fold_img">
  <img src="fold.png">
 </a>
 </div>`
}

function genTreeUl (menuListTree, isroot) {
 let li_str = ''
 menuListTree.forEach((item, index) => {
  li_str += `<li><a class="${isroot && index === 0 ? 'active' : ''}" href="#/?id=${item.target_id}">${item.name}</a>${Array.isArray(item.children) && item.children.length > 0 ? genTreeUl(item.children) : ''}</li>`
 })
 return `<ul>${li_str}</ul>`
}

function findParent (list, item, index, canpush) {
 if (index < 0) return false
 if (list[index].level + 1 === item.level) {
  if (canpush) {
   if (!list[index].children) list[index].children = []
   list[index].children.push(item)
  }
  return true
 } else if (index - 1 >= 0 && list[index].level === item.level) {
  return findParent(list, item, index - 1, canpush)
 } else {
  return false
 }
}

function deelMenuList (menuList) {
 let tree = []
 menuList.forEach((item, index) => {
  findParent(menuList, item, index - 1, true)
 })
 menuList.forEach((item, index) => {
  if (!index || (item.level !== menuList[index - 1].level + 1 && !findParent(menuList, item, index - 1))) {
   tree.push(item)
  }
 })
 return tree
}

function renderTemplate (path, options) {
 let str = fs.readFileSync(path).toString()
 const __matchs = [...str.matchAll(/{{([^({{)(}})]*)}}/g)] // [^({{)(}})]
 __matchs.forEach(m => {
  if (options[m[1]]) {
   str = str.replace(m[0], options[m[1]])
  }
 })
 const sc__matchs = [...str.matchAll(/{%(.*)_start([^%]*)end_(.*)%}/g)]
 for (let i = 0; i < sc__matchs.length; i++) {
  const m = sc__matchs[i]
  if (m[1] !== m[3]) {
   continue
  } else {
   const htmlstar = new Function(m[1], m[2])
   str = str.replace(m[0], htmlstar(options[m[1]]))
  }
 }
 return str
}

const passwords = []

async function setPasswords () {
 const rl = readline.createInterface({
  input: fs.createReadStream(".passwords"),
  crlfDelay: Infinity
 })
 rl.on('line', (line) => {
  if (!passwords.includes(line.trim())) {
   passwords.push(line.trim())
  }
 });

 await events.once(rl, 'close');
}
setPasswords()

const screct = '_ax33daw_'

function getPassordMd (password) {
 return md5(password + screct + new Date().Format("yyyy-MM-dd")) // 一天输入一次密码
}
function validate_password (cookie) {
 if (cookie) {
  let passvalue = ''
  cookie.split(";").forEach(item => {
   if (item.split("=")[0].trim() === 'pass') {
    passvalue = item.split("=")[1].trim()
   }
  })
  let flag = false
  passwords.forEach(password => {
   if (passvalue === getPassordMd(password)) {
    flag = true
   }
  })
  return flag
 }
 return false
}

//监听request请求事件 设置请求处理函数
server.on('request', function (request, response) {
 const url = request.url //端口号后面的那一部分
 if (url === '/' || url === '/md') {
  if (validate_password(request.headers.cookie)) {
   response.write("<head><meta charset='utf-8'></head>")
   const csslink = '<link rel="stylesheet" type="text/css" href="sspai.css"><link rel="stylesheet" type="text/css" href="common.css">'
   const str = fs.readFileSync("./mds/README.md").toString()
   // 正则match
   const html = `<div id="markdown_container">
   ${marked(str)}
   </div>`
   const menustr = gengorMenu(html)
   const scripts = '<script src="doc.js"></script>'
   response.end(csslink + `<div id="main">${menustr + html}</div>` + scripts)
  } else {
   response.writeHead(301, { 'Location': '/hi.html' });
   response.end()
  }
 } else if (url.startsWith("/pass")) {
  const password = getQueryString("password", url)
  if (passwords.includes(password)) {
   response.setHeader('Set-Cookie', ['pass=' + getPassordMd(password), 'a=1']); // ⑤
   response.writeHead(301, { 'Location': '/md' });
  } else {
   response.writeHead(301, { 'Location': '/hi.html' });
  }
  response.end()
 } else if (url === '/hi.html') {
  // const str = fs.readFileSync("./hi.html")
  response.end(renderTemplate("./hi.html", require("./config")))
 } else {
  readStaticFiles(request, response)
 }
})

//绑定端口号 启动服务
server.listen(9988, function () {
 console.log('已经开启您的http服务器')
 console.log('访问地址：http:127.0.0.1:9988/')
})
