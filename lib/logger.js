const chalk = require("chalk")

module.exports = {
 error: msg => { 
  console.log(chalk.red(msg))
 },
 success: msg => {
  console.log(chalk.green(msg))
 },
 primary: msg => {
  console.log(chalk.blue(msg))
 },
 info: msg => {
  console.log(chalk.grey(msg))
 },
 log: msg => {
  console.log(msg)
 },
 reg: msg => {
  // $text$#colortext;
  const ms = msg.matchAll(/\$([^\$]*\$\#[0-9a-fA-F]{3,8})/)
  console.log(ms)
 },
 dict: dict => {
  if(typeof dict === 'object') {
   for(let key in dict) {
    console.log(`${chalk.blue(key)}: ${typeof dict[key] === 'string' ? `'${dict[key]}'`: dict[key]}     `)
   }
  } else {
   console.log(dict)
  }
 }
}