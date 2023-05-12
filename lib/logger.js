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
 }
}