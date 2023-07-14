const { FSDB } = require("file-system-db");
const { v4: uuidv4 } = require('uuid');

module.exports =function (config) {
 const db = new FSDB("./comment-db.json", true);
 /**
  * add a new comment
  * @param {*} aindex article index
  * @param {*} parentid parent id
  */
 function addComment (aindex, parentid, content, user) {
  const id = uuidv4()
  const date = new Date()
  db.push(aindex, {
   id,
   content,
   time: date.Format("yyyy-MM-dd hh:mm:ss"),
   user,
   parentid,
  })
 }

 function deleteComment (aindex, id) {
  const comments = db.get(aindex)
  let temp = []
  comments.forEach(item => {
   if (item.id !== id) {
    temp.push(item)
   }
  })
  db.set(aindex, temp)
 }

 function getComments (aindex) {
  return db.get(aindex)
 }

 return { addComment, deleteComment, getComments }
}