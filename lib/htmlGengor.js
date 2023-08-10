const path = require("path")
const fs = require("fs")
const urlencode = require("urlencode")
module.exports = config => {
    const {
        readDirAsync,
        fileStatAsync,
    } = require("./useUtils")(config)
    const header_htmls = config.htmls.filter(item => item.nav) || []

    function getHeaders(html) {
        let navs = []
        header_htmls.forEach(item => {
            if (html.index === item.index) {
                navs.push(`<li class="header-menu-item menu-item-active"><a  class="header-menu-link" href="${Array.isArray(item.index) ? item.index[0] : item.index}" >${item.title}</a></li>`)
            } else {
                navs.push(`<li class="header-menuitem"><a  class="header-menu-link" href="${Array.isArray(item.index) ? item.index[0] : item.index}" >${item.title}</a></li>`)
            }
        })
        return `
  <header>
<div id="navContainer" class="header-container">
<a href="/" class=" header-title">${config.title}</a>
 <ul id="navList" class="">
 ${navs.join("\n")}
 </ul>
 <div id="navListMask"></div>
 <a id="navFold" class="fold">
 <img src="images/open.gif">
 </a>
</div>
<script>
$("#navFold").click(function() {
    const isActive = $("#navContainer").hasClass("fold-active")
    if(isActive) {
        $("#navContainer").removeClass("fold-active")
    } else {
         $("#navContainer").addClass("fold-active")
    }
})
$("#navListMask").click(function() {
  $("#navContainer").removeClass("fold-active")
})
</script>
  </header>
  <div class="header-slot"></div>
  `
    }

    function getFooter(html) {
        return `
  <footer class="footer">
  <div class="container-fluid container-footer">
  <ul class="list-inline">

  <li><p class="fcode-links">
  <a href="https://www.zaihua.net/links">友情链接</a>
 <a href="https://www.zaihua.net/privacy-policy">免责声明</a>
 <a href="/about">关于我们</a>
 </p>
 <div class="footer-muted em09">©&nbsp;2021-2023&nbsp;·&nbsp;<a href="https://www.zaihua.net/">在花</a>&nbsp;·&nbsp;<a href="https://icp.gov.moe/?keyword=20211299" target="_blank">萌ICP备20211299号</a></div><div class="footer-contact mt10 hidden-xs"></div></li></ul>	</div>
 </footer>
 `
    }

    function getMdInfo(mdstr) {
        const infos_match = mdstr.match(/---\s([\s\S]*)\s---/)
        const attr_matchs = [...infos_match[1].matchAll(/(\w*):(.*)/g)]
        let attr = {}
        attr_matchs.forEach(item => {
            attr[item[1].trim()] = item[2].trim()
        })
        return attr
    }


    async function getMdInfos(md_path, base_type = "") {
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
                        typeinfo.children = await getMdInfos(file_path, base_type ? (base_type + '--' + type) : type)
                        mdinfos.push(typeinfo)
                    } else if (stat.isFile()) {
                        const mdstr = fs.readFileSync(file_path, 'utf-8').toString()
                        // const infos_match = mdstr.match(/---\s([\s\S]*)\s---/)
                        // const attr_matchs = [...infos_match[1].matchAll(/(\w*):(.*)/g)]
                        // let attr = {}
                        // attr_matchs.forEach(item => {
                        //  attr[item[1].trim()] = item[2].trim()
                        // })
                        let attr = getMdInfo(mdstr)
                        attr.index = `/mds-${base_type ? (base_type + "--") : base_type}${files[i].replace(".md", "")}`
                        mdinfos.push(attr)
                    }
                }
            }
        } catch (err) {
            console.log(err)
        }

        return mdinfos
    }


    function getTypeModule(mdinfos) {
        function getType(mdinfos, base_type = "") {
            let typelist = "", types = []
            mdinfos.forEach(item => {
                if (item.type) {
                    let type_encode = urlencode.encode((base_type ? (base_type + '-') : base_type) + item.type, 'utf8')
                    typelist += `
          <li>
            <a class="hover-line" href="/type-index?type=${type_encode}">${item.type}</a>
          </li>
        `
                    let type_temp = {
                        type: item.type
                    }
                    if (item.children && item.children.length > 0) {
                        let children_ul = getType(item.children, (base_type ? (base_type + '-') : base_type) + item.type).typelist
                        typelist +=children_ul ? `<li><ul>${children_ul}</ul> </li>` : ''
                        type_temp.children = getType(item.children, base_type + '-' + item.type).types
                    }

                    types.push(type_temp)
                }
            })

            return {typelist, types}
        }

        const {typelist, types} = getType(mdinfos)

        return {
            type_module_html: `
  <div class="type-tree">
  <ul>
  ${typelist}
  </ul>
  </div>
  `,
            types
        }
    }

    function getTagModule(mdinfos,) {
        let tags = new Set()

        function getTags(mdinfos, tags) {
            Array.isArray(mdinfos) && mdinfos.forEach(item => {
                if (item.tag) {
                    item.tag.split(",").forEach(item1 => {
                        tags.add(item1)
                    })
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
            let tag_encode = urlencode.encode(item, 'utf8')
            return `
    <a href="/tag-index?tag=${tag_encode}">${item}</a>
    `
        })


        return {
            tags_module_html: `
   <div class="tag-list">
   ${tag_html}
   </div>
   `,
            tags,
        }
    }

    function getTimeLineModule(mdinfos) {
        const md_list = getMdList(mdinfos)
        let mds = new Set()

        function get_times(mdinfos, _mds) {
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
        const timeline = [...mds].map(item => new Date(item).getTime()).sort().map(item => {
            const date_string = new Date(item).Format("yyyy-MM-dd")
            let mds = []
            md_list.forEach(item => {
                const item_datetime = new Date(item.time).Format("yyyy-MM-dd")
                if (item_datetime === date_string) {
                    mds.push(item)
                }
            })
            return {
                time: date_string,
                mds,
            }
        })
        return {
            timeline,
            timeline_module_html: `
    <ul class="timeline-ul">
${timeline.map(item => `<li>${item.time}</li><ul class="md-list">` + item.mds.map(item1 => `<li><a href="${item1.index}">${item1.title}</a></li>`) + `</ul>`)}
    </ul>
   `
        }
    }


    function getMdList(mdinfos) {
        let mds = []

        function getMds(mdinfos, base_type = '') {
            Array.isArray(mdinfos) && mdinfos.forEach(item => {
                if (item.title) {
                    mds.push({
                        ...item,
                        type: base_type
                    })
                } else if (item.type && item.children) {
                    getMds(item.children, base_type ? (base_type + '-' + item.type) : item.type)
                }
            })
        }

        getMds(mdinfos)
        return mds
    }

    function renderEditMenu(mdInfos) {
        function EditMenu(mdinfos, base_type = "") {
            let typelist = ""
            mdinfos.forEach(item => {
                if (!item.title) {
                    typelist += `
          <li class="type-li" data-type="${(base_type ? (base_type + '-') : base_type) + item.type}">
            <a class="li-title" data-type="${(base_type ? (base_type + '-') : base_type) + item.type}">${item.type}</a>
            <div class="flex">
                <a class="delete-type"  href="/api/admin/deleteType?type=${(base_type ? (base_type + '-') : base_type) + item.type}">-删除</a>
                <a class="add-type" data-type="${(base_type ? (base_type + '-') : base_type) + item.type}">+分类</a>
                <a class="add-md" href="/md-edit.html?type=${(base_type ? (base_type + '-') : base_type) + item.type}">+文章</a>
            </div>
          </li>
        `

                    if (item.children && item.children.length > 0) {
                        let children_ul = EditMenu(item.children, (base_type ? (base_type + '-') : base_type) + item.type)
                        typelist +=children_ul ? `<li class="submenu"><ul>${children_ul}</ul> </li>` : ''
                    }

                } else {
                    typelist += `
          <li class="md-li" data-type="${base_type}" data-title="${item.title}">
            <a class="li-title" href="/md-edit.html?type=${base_type}&title=${item.title}">${item.title}</a>
          </li>
        `
                }
            })

            return typelist
        }

        return `<ul class="root">${EditMenu(mdInfos)}</ul>`
    }

    return {
        getHeaders,
        getFooter,

        getMdInfos,
        getTypeModule,
        getTagModule,
        getMdList,

        getTimeLineModule,
        getMdInfo,
        renderEditMenu,
    }
}
