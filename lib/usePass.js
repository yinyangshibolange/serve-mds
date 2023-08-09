const fs = require("fs")
const path = require("path")
const readline = require('readline');
const events = require('events');
const md5 = require("md5")
const passwords = []
const logger = require("./logger")


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


module.exports = function (config) {
 if (config.admin_password) {
  passwords.push(config.admin_password)
 }

 async function setPasswords () {
  try {
   const rl = readline.createInterface({
    input: fs.createReadStream(path.resolve(process.cwd(), ".passwords")),
    crlfDelay: Infinity
   })
   rl.on('line', (line) => {
    if (!passwords.includes(line.trim())) {
     passwords.push(line.trim())
    }
   });
   await events.once(rl, 'close');
  } catch (err) {
   logger.error(err)
  }
 }
 setPasswords()


 function getPassordMd (password) {
  return md5(password + config.app_screct + new Date().Format("yyyy-MM-dd")) // 一天输入一次密码
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
   // passwords.forEach(password => {
   //  if (passvalue === getPassordMd(password) || passvalue === config.admin_password) {
   //   flag = true
   //  }
   // })
   if(passvalue === getPassordMd(config.admin_password)) {
    flag = true
   }
   return flag
  }
  return false
 }

 return {
  passwords,
  getPassordMd,
  validate_password,
 }
}
