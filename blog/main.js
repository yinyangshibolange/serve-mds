const { initUserSpace, startServe } = require("../lib/handle")

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
 startServe(spacePath)
}else if( process.argv.slice(2)[0].trim() === 'build'){
 if(process.argv.slice(2)[1] === '-p') {
  spacePath = process.argv.slice(2)[2] || ''
 }
 startServe(spacePath)
}