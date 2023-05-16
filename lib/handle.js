const logger = require("./logger")
const path = require("path")
const chalk = require("chalk")
const pkg = require('../package.json');
const fs = require("fs")
const readline = require("readline");


function isDirExists (path) {
 return new Promise((resolve, reject) => {
  fs.stat(path, function (err, stats) {
   if (!err && stats.isDirectory()) {
    resolve(stats)
   } else {
    reject(err)
   }
  })
 })
}

function isFileExists (path) {
 return new Promise((resolve, reject) => {
  fs.stat(path, function (err, stats) {
   if (!err && stats.isFile()) {
    resolve(stats)
   } else {
    reject(err)
   }
  })
 })
}

function readAndWrite (source, target) {
 return new Promise((resolve, reject) => {
  fs.readFile(source, function (err, data) {
   if (err) {
    logger.error(`【${source}】读取失败`)
    reject({
     err,
     path: source
    })
   } else {
    fs.writeFile(target, data.toString(), function (err) {
     if (err) {
      logger.error(`写入【${target}】失败`)
      reject({
       err,
       path: target
      })
     } else {
      logger.success(`写入【${target}】成功`)
      resolve(target)
     }
    })
   }
  })
 })

}

// 创建readline接口实例
let rq = readline.createInterface({
 input: process.stdin,
 output: process.stdout
})
//close事件监听
rq.on("close", function () {
 // 结束程序
 process.exit(0);
})
function yesOrNo (text) {
 return new Promise((resolve, reject) => {
  //调用接口方法
  rq.question(`${text}(y/n)`, function (answer) {
   if (answer.toLocaleLowerCase() === 'y') {
    resolve('yes')
   } else {
    reject('no')
   }
   // 不加close，则不会结束
   // rq.close();
  })

 })
}

async function initUserSpace (userpath) {
 let userspace_path
 try {
  if (userpath) {
   logger.info("您输入的路径是【" + userpath + "】")
   await isDirExists(userpath)
   userspace_path = userpath
  }
 } catch (err) {
  logger.info("您输入的文件路径不存在")
 }

 if (!userspace_path) {
  try {
   await yesOrNo("是否在当前目录初始化项目")
   userspace_path = process.cwd()
  } catch (err) {

  }
 }

 if(!userspace_path) {
  logger.error("项目初始化失败")
  process.exit(0)
 }

 logger.log(`项目${chalk.blue("【初始化】 ")}，路径： ${userspace_path}!`)

 let config_source = path.resolve(__dirname, "default-config.js")
 let config_target = path.resolve(userspace_path, "serve-mds.config.js")
 try {
  await readAndWrite(config_source, config_target)
 } catch (err) {
  logger.error("请手动创建配置文件serve-md.config.js")
 }

 const passwordsFile = path.resolve(userspace_path, ".passwords")
 fs.writeFile(passwordsFile, "123456\n234567\n", function (err) {
  if (err) {
   logger.error("密码本.passwords写入失败，请手动创建.passwords文件并输入密码（一行输入一个密码）")
  } else {
   logger.success("密码本.passwords写入成功")
  }
 })



 fs.mkdir(path.resolve(userspace_path, "mds"), async function (err) {
  if (err) {
   logger.error("文件夹mds创建失败，请手动创建markdown根文件夹mds")
  } else {
   logger.success("文件夹mds创建成功")
   let config_source = path.resolve(__dirname, "../README.md")
   let config_target = path.resolve(userspace_path, "mds/index.md")
   try {
    await readAndWrite(config_source, config_target)
   } catch (err) {
    logger.error("请手动创建配置文件mds/index.md")
   }
  }
 })

 fs.mkdir(path.resolve(userspace_path, "static"), function (err) {
  if (err) {
   logger.error("静态资源文件夹static创建失败，您可手动创建静态资源根文件夹static")
  } else {
   logger.success("静态资源文件夹static创建成功")
  }
 })

}



async function startServe (configFilePath) {
 const userspace_path = process.cwd()
 let filepath = ''
 try {
  if (configFilePath) {
   filepath = path.resolve(userspace_path, configFilePath)
  } else {
   filepath = path.resolve(userspace_path, "serve-mds.config.js")
  }
  await isFileExists(filepath)

 } catch (err) {
  logger.error(`配置文件【${configFilePath}】不存在`)
  throw Error(`配置文件【${configFilePath}】不存在`)
 }
 let config = require("./default-config")
 config = Object.assign(config, require(filepath))
 logger.primary("-配置文件如下：")
 logger.dict(config)
 logger.primary("-")
 if (config.need_password) {
  try {
   await isFileExists(path.resolve(userspace_path, ".passwords"))
  } catch (err) {
   logger.info(`系统需要登录，但是密码本文件.passwords不存在，请创建密码本文件`)
   throw Error(`系统需要登录，但是密码本文件.passwords不存在，请创建密码本文件`)
  }
 }
 const mdsDirPath = config.mds_dir || 'mds'
 const indexFilePath = config.index_md || 'index'
 try {
  await isDirExists(path.resolve(userspace_path, mdsDirPath))
 } catch (err) {
  logger.error(`markdown文件夹【${mdsDirPath}】不存在，请先创建`)
  throw Error(`markdown文件夹【${mdsDirPath}】不存在，请先创建`)
 }
 try {
  const indexmd_filepath = path.resolve(userspace_path, mdsDirPath, indexFilePath.endsWith(".md") ? indexFilePath : indexFilePath + '.md')
  logger.primary(indexmd_filepath)
  await isFileExists(indexmd_filepath)
 } catch (err) {
  logger.error(`首页md文件【${mdsDirPath}/${indexFilePath}】不存在，请先创建`)
  throw Error(`首页md文件【${mdsDirPath}/${indexFilePath}】不存在，请先创建`)
 }
 require(path.resolve(__dirname, "./index"))(config)
}

module.exports = {
 initUserSpace,
 startServe,
}