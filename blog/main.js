const { initUserSpace, startServe } = require("../lib/handle")
const path = require("path")

let spacePath = ''
if(process.argv.slice(2)[0].trim() === 'init') {
 if(process.argv.slice(2)[1] === '-p') {
  spacePath = process.argv.slice(2)[2] || ''
 }
 initUserSpace(spacePath)
} else if( process.argv.slice(2)[0].trim() === 'start'){
 if(process.argv.slice(2)[1] === '-p') {
  spacePath = process.argv.slice(2)[2] || ''
 }
 spacePath= path.resolve(__dirname, "./")
 startServe(spacePath)
}else if( process.argv.slice(2)[0].trim() === 'build'){
 if(process.argv.slice(2)[1] === '-p') {
  spacePath = process.argv.slice(2)[2] || ''
 }
 startServe(spacePath)
}
