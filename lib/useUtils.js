
const zlib = require("zlib")
const mime = require("mime")
const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const logger = require("./logger")

module.exports = function (config) {
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

  function openDefaultBrowser (url) {
    var exec = require('child_process').exec;
    switch (process.platform) {
      case "darwin":
        exec('open ' + url);
        break;
      case "win32":
        exec('start ' + url);
        break;
      default:
        exec('xdg-open', [url]);
    }
  }

  function readPartFile(src, length){
    return new Promise((resolve, reject) => {
      var buff=Buffer.alloc(length);
      fs.stat(src,(err,stat)=>{
        if(err)
        {
          throw err;
        }
        if(stat.isFile()){
          let size=stat.size;//文件总字节
          fs.open(src,'r+',(err,fd)=>{
            if(err){
              throw err;
            }
            // fd, read to buff, buffer offset, length, read position
            fs.read(fd,buff,0,buff.length,buff.length,(err,bytes,buf)=>{
              if(err){
                throw err;
              }
              resolve(buf)
            });
          });
        }
      });
    })

  }


  async function cacheFile (req, res, filePath, fileStat) {
    res.setHeader('Cache-Control', 'max-age=10'); // 设定强制缓存，时间为10秒
    res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toUTCString())
    res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8'); // 用mime模块为不同文件类型设置对应的响应头
    const lastModifyed = fileStat.ctime.toGMTString(); // 获取文件最后修改时间

    // 读取部分文件作为etag
    const fileBuffer =     await readPartFile(filePath, 1024 * 2)
    const etag = crypto.createHash('md5').update(fileBuffer).digest('base64');
    // console.log(etag)
    res.setHeader('Last-Modified', lastModifyed); // 设定最后修改时间的响应头
    res.setHeader('Etag', etag); // 设置Etag响应头
    const ifModifiedSince = req.headers['if-modified-since']; // 获取上一次修改时间
    const ifNoneMatch = req.headers['if-none-match']; // 与Etag搭配使用的请求头，对比Etag值，如果相同则表示文件没变化，可走缓存，否则重新加载
    // console.log(req.headers, res.getHeaders())
    if (ifModifiedSince !== lastModifyed) { // 判断文件的最后修改时间和请求头里最后的修改时间是否相同
      return false;
    }
    if (etag !== ifNoneMatch) { // 判断 Etag和ifNoneMatch值是否相同
      return false;
    }
    return true;
  }

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

  function write404 (response) {
    response.writeHead(404);
    response.end('404 Not Found');
  }

  async function fileReadStream (request, response, filepath, stats) {
    const isCache = await cacheFile(request, response, filepath, stats)
    if (isCache) { // 如果文件符合缓存策略就使用缓存，返回状态码304
      response.statusCode = 304;
      response.end();
    } else {

      let createCompress; // 定义压缩流
      if (createCompress = gzipFile(request, response)) {  // 如果文件符合压缩策略就创建压缩流
        fs.createReadStream(filepath).pipe(createCompress).pipe(response);  // 以流管道的形式将文件模板压缩后再输出到页面显示
      } else {
        fs.createReadStream(filepath).pipe(response);  // 以流管道的形式将文件模板输出到页面显示
      }
    }
  }

  async function readStaticFiles (request, response) {
    if (!request.url.startsWith("/")) {
      response.writeHead(416);
      response.end('416 页面无法提供请求的范围。');
      return
    }
    const filepath = path.resolve(__dirname, "../static", "." + request.url)

    if (config.static_fold.startsWith("..") || config.static_fold === "/") {
      logger.error("静态资源配置存在安全漏洞，请尽快检查并更正")
    }

    async function write_your_path () {
      const yourPath = path.resolve(process.cwd(), config.static_fold, "." + request.url)
      try {
        const stats = await isFileExist(yourPath)
        await fileReadStream(request, response, yourPath, stats)
      } catch (err) {
        try {
          const stats = await isFileExist(filepath)
          await fileReadStream(request, response, filepath, stats)
        } catch (err) {
          write404(response)
        }
      }
    }

    if (!config.static_fold) {
      try {
        const stats = await isFileExist(filepath)
        await fileReadStream(request, response, filepath, stats)
      } catch (err) {
        await write_your_path()
      }
    } else {
      await write_your_path()
    }
  }



  // 获取cookie过期时间
  function getNextExpire () {
    const nowDateTime = new Date().getTime()
    if (config.pass_expire === 'day') {
      return 'expires=' + new Date(nowDateTime + 24 * 60 * 60 * 1000).toUTCString()
    } else if (config.pass_expire === 'hour') {
      return 'expires=' + new Date(nowDateTime + 60 * 60 * 1000).toUTCString()
    } else if (/[1-9][0-9]*hours/.test(config.pass_expire)) {
      const m = config.pass_expire.match(/([1-9][0-9]*)hours/)
      try {
        return 'expires=' + new Date(nowDateTime + (+m[1]) * 60 * 60 * 1000).toUTCString()
      } catch (err) {
        return 'a=1'
      }
    } else if (/[1-9][0-9]*days/.test(config.pass_expire)) {
      const m = config.pass_expire.match(/([1-9][0-9]*)days/)
      try {
        return 'expires=' + new Date(nowDateTime + (+m[1]) * 24 * 60 * 60 * 1000).toUTCString()
      } catch (err) {
        return 'a=1'
      }
    } else {
      return 'a=1'
    }
  }

  /**
   * 读取html文件
   */
  function readEjs (html_path) {
    if (!html_path) return ""
    const htmlpath = path.resolve(process.cwd(), html_path)

    let htmlString = ''
    try {
      htmlString = fs.readFileSync(htmlpath, 'utf-8').toString()
    } catch (err) {
      htmlString = ""
    }
    return htmlString || "<html><head></head><body></body></html>"
  }


  function readDirAsync (md_path) {
    return new Promise((resolve, reject) => {
      fs.readdir(md_path, function (err, files) {
        if (err) {
          reject(err)
        } else {
          resolve(files)
        }
      })
    })
  }

  function fileStatAsync (file) {
    return new Promise((resolve, reject) => {
      fs.stat(file, function (err, stat) {
        if (err) {
          reject(err)
        } else {
          resolve(stat)
        }
      })
    })
  }


function replaceHeader(html, header) {
  const head_match = html.match(/<head>([\s\S]*)<\/head>/)
  if (!head_match) {
    const html_match = html.match(/<html>([\s\S]*)<\/html>/)
    if (html_match) return html.replace(head_match[0], `<html><head>${header}</head>${head_match[1]}</html>`)
    return `<html><head>${header}</head>${html}</html>`
  } else {
    return html.replace(head_match[0], `<head>${head_match[1]}${header}</head>`)
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
  return {
    getQueryString,
    readStaticFiles,
    getNextExpire,
    openDefaultBrowser,
    readEjs,

    readDirAsync,
    fileStatAsync,

    replaceHeader,
    replaceBody,
    replaceMeta,
    replaceTitle
  }
}

