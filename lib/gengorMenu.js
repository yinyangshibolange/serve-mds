function gengorMenu (md_html, max_levels) {
 let newHtml = md_html
 const _max_levels = max_levels && max_levels > 0 && max_levels <= 6 ? max_levels : 6
 const match_reg = new RegExp(`<h([1-${_max_levels}]) id="(.*)">([^<>]+)</h[1-${_max_levels}]>`, 'g')
 const matchs_arr = [...newHtml.matchAll(match_reg)]
 const menuList = []



 // 获取到所有标题
 matchs_arr.forEach(item => {
  let encodeTargetId = item[2]
  const idMatch = item[0].match(/id="(.*)"/)
   encodeTargetId = 'h__' + require('md5')(item[2])
  newHtml = newHtml.replace(item[0], item[0].replace(idMatch[0], idMatch[0].replace(idMatch[1], encodeTargetId)))
  menuList.push({
   target_id: encodeTargetId,
   name: item[3],
   level: +item[1],
  })
 })
 const menuListTree = deelMenuList(menuList) // 所有标题节点构建标题树
 return {
  menu: `<div id="menu_tree" class="menu_tree">${genTreeUl(menuListTree, true)}
 </div>
 <a id="fold_img" class="fold_img">
 <img src="fold.png">
</a>
 `,
  content: newHtml
 }
}

function genTreeUl (menuListTree, isroot) {
 let li_str = ''
 menuListTree.forEach((item, index) => {
  li_str += `<li><a class="${isroot && index === 0 ? 'active' : ''}" href="#/?id=${item.target_id}&encode=1">${item.name}</a>${Array.isArray(item.children) && item.children.length > 0 ? genTreeUl(item.children) : ''}</li>`
 })
 return `<ul>${li_str}</ul>`
}

/**
 * 判断当前节点是否是上一个节点的子节点，如果是，设置为上一个节点的子节点
 * @param {*} list 列表
 * @param {*} item 当前节点
 * @param {*} index 上一个节点的index
 * @param {*} canpush 是否设置为子节点
 * @returns 是否找到父节点，找到返回true
 */
function findParent (list, item, index, canpush) { // 
 if (index < 0) return false
 if (list[index].level + 1 === item.level) { // 找到子节点
  if (canpush) {
   if (!list[index].children) list[index].children = []
   list[index].children.push(item)
  }
  return true
 } else if (index - 1 >= 0 && list[index].level === item.level) { // 上一个不是父节点，那么判断上一个level和当前level是否相同，相同的话继续向上找
  return findParent(list, item, index - 1, canpush)
 } else {
  return false
 }
}

/**
 * 所有标题节点构建标题树
 * @param {Array} menuList 所有标题节点
 * @returns 
 */
function deelMenuList (menuList) {
 let tree = []
 menuList.forEach((item, index) => {
  findParent(menuList, item, index - 1, true)
 })
 menuList.forEach((item, index) => {
  if (!index || (item.level !== menuList[index - 1].level + 1 && !findParent(menuList, item, index - 1))) {
   tree.push(item)
  }
 })
 return tree
}

module.exports = gengorMenu