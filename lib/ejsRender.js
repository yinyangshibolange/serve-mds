const ejs = require("ejs")
module.exports = function(config) {
 function renderEjs(ejsString, htmlConfig, urlIndex, data) {
  return ejs.render(ejsString, data)
 }

 return {
  renderEjs,
 }
}