
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

  function fileReadStream (request, response, filepath, stats) {
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

    async function write_your_path() {
      const yourPath = path.resolve(process.cwd(), config.static_fold, "." + request.url)
      try {
        const stats = await isFileExist(yourPath)
        fileReadStream(request, response, yourPath, stats)
      } catch (err) {
        try {
          const stats = await isFileExist(filepath)
          fileReadStream(request, response, filepath, stats)
        } catch (err) {
          write404(response)
        }
      }
    }

    if (!config.static_fold) {
      try {
        const stats = await isFileExist(filepath)
        fileReadStream(request, response, filepath, stats)
      } catch (err) {
        await write_your_path()
      }
    } else {
      await write_your_path()
    }
  }

  function getMdInfos(mds_dir) {

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
  function readHtmlFiles(html_path) {
    if(!html_path) return ""
    const htmlpath = path.resolve(process.cwd(),  html_path.endsWith('.html') ? html_path : html_path + '.html')
    
    try {
      return fs.readFileSync(htmlpath, 'utf-8').toString()
    } catch (err) {
      return ""
    }
  }
  return {
    getQueryString,
    readStaticFiles,
    getNextExpire,
    openDefaultBrowser,
    readHtmlFiles,
  }
}

