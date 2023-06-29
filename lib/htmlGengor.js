
module.exports = config => {
 const { readDirAsync,
  fileStatAsync, } = require("./useUtils")(config)
 const header_htmls = config.htmls.filter(item => item.nav) || []
 function getHeaders () {
  let navs = []
  header_htmls.forEach(item => {
   navs.push(`<a href="${Array.isArray(item.index) ? item.index[0] : item.index}" >${item.title}</a>`)
  })
  return `
  <header>
   <nav>
   ${navs.join("\n")}
   </nav>
  </header>
  `
 }

 function getFooter () {
  return `
  <footer class="footer">
  <div class="container-fluid container-footer">
  <ul class="list-inline"><li class="hidden-xs" style="max-width: 300px;"></li><li style="max-width: 550px;"><p class="fcode-links"><a href="https://www.zaihua.net/links">友情链接</a>
 <a href="https://www.zaihua.net/privacy-policy">免责声明</a>
 <a href="https://www.zaihua.net/me">关于我们</a></p><div class="footer-muted em09">©&nbsp;2021-2023&nbsp;·&nbsp;<a href="https://www.zaihua.net/">在花</a>&nbsp;·&nbsp;<a href="https://icp.gov.moe/?keyword=20211299" target="_blank">萌ICP备20211299号</a></div><div class="footer-contact mt10 hidden-xs"></div></li><li class="hidden-xs"></li></ul>	</div>
 </footer>
 `
 }


 async function getMdInfos (md_path) {
  let mdinfos = []
  try {
   const files = await readDirAsync(md_path)
   if (Array.isArray(files)) {
    for (let i = 0; i < files.length; i++) {
     const file_path = path.resolve(md_path, files[i])
     const stat = await fileStatAsync(file_path)
     if (stat.isDirectory()) {
      const type = files[i]
      const typeinfo = {
       type,
       children: [],
      }
      typeinfo.children = await getMdInfos(file_path)
      mdinfos.push(typeinfo)
     } else if (stat.isFile()) {
      const mdstr = fs.readFileSync(file_path, 'utf-8').toString()
      const infos_match = mdstr.match(/---\s([\s\S]*)\s---/)
      const attr_matchs = [...infos_match[1].matchAll(/(\w*):(.*)/g)]
      let attr = {}
      attr_matchs.forEach(item => {
       attr[item[1].trim()] = item[2].trim()
      })
      mdinfos.push(attr)
     }
    }
   }
  } catch (err) {
   console.log(err)
  }

  return mdinfos
 }



 function getTypeModule (mdinfos) {
  function getType (mdinfos, base_type = "") {
   let typelist = ""
   mdinfos.forEach(item => {
    if (item.type) {
     typelist += `
          <li>
            <a href="/type-index?type=${base_type ? (base_type + '-' + item.type) : item.type}">${item.type}</a>
          </li>
        `
     if (item.children) {
      typelist +=
       `
              <li>
              <ul>
                ${getType(item.children, item.type)}
              </ul>
              </li>
            `
     }
    }
   })

   return typelist
  }

  return `<section id="type-module module">
  <div class="title">分类</div>
 <div class="type-tree">
 <ul>
 ${getType(mdinfos)}
 </ul>
 </div>
  </section>`
 }
 function getTagModule (mdinfos,) {
  let tags = new Set()

  function getTags (mdinfos, tags) {
   Array.isArray(mdinfos) && mdinfos.forEach(item => {
    if (item.tag) {
     tags.add(item.tag)
    }
    if (item.children) {
     getTags(item.children, tags)
    }
   })
   return tags
  }

  getTags(mdinfos, tags)

  tags = [...tags]

  const tag_html = tags.map(item => {
   return `
    <a href="/tag-index?tag=${item}">${item}</a>
    `
  })


  return `
  <section class="tag-module module">
  <div class="title">标签</div>
  <div class="tag-list">
  ${tag_html}
  </div>
  </section>
  `
 }

 function getTimeLineModule () {
  let mds = new Set()
  function get_times (mdinfos, _mds) {
   Array.isArray(mdinfos) && mdinfos.forEach(item => {
    if (item.time) {
     _mds.add(item.time)
    } else if (item.type && item.children) {
     get_times(item.children, _mds)
    }
   })
   return _mds
  }
  get_times(mdinfos, mds)
  return [...mds].map(item=> new Date(item).getTime()).sort().map(item => new Date(item).Format("yyyy-MM-dd"))
 }


 function getMdList (mdinfos) {
  let mds = []
  function getMds (mdinfos, _mds) {
   Array.isArray(mdinfos) && mdinfos.forEach(item => {
    if (!item.type) {
     _mds.push(item)
    } else if (item.type && item.children) {
     getMds(item.children, _mds)
    }
   })
   return _mds
  }
  getMds(mdinfos, mds)
  return mds
 }

 return {
  getHeaders,
  getFooter,

  getMdInfos,
  getTypeModule,
  getTagModule,
  getMdList,

  getTimeLineModule,
 }
}