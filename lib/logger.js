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
 dict: dict => {
  if(typeof dict === 'object') {
   for(let key in dict) {
    console.log(`【${chalk.blue(key)}】：${dict[key]}     `)
   }
  } else {
   console.log(dict)
  }
 }
}