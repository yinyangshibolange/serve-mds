module.exports = [{
 title: "密码认证",
 type: 'html',
 meta: "",
 index: ["/auth", "/auth.html"],
 path: "htmls/auth.ejs",
 'Cache-Control': 'max-age=0'
}, {
 title: "文章编辑",
 type: 'html',
 meta: "",
 index: ["/md-edit", "/md-edit.html"],
 path: "htmls/md-edit.ejs",
 need_password: true,
 'Cache-Control': 'max-age=0'
}, {
 nav: true,
 title: "鸡",
 type: 'html',
 meta: "",
 index: ["/", "/index.html"],
 path: "htmls/index.ejs",
 showHeader: true,
 showFooter: true,
 // showType: true,
 // showTag: true,,
  'Cache-Control': 'max-age=60'
}, {
 nav: true,
 title: "你",
 type: 'html',
 meta: "",
 index: ["/types", "/types.html"],
 path: "htmls/types.ejs",
 showHeader: true,
 showFooter: true,
 content: "types",
 'Cache-Control': 'max-age=60'
}, {
 title: "标签",
 type: 'html',
 meta: "",
 index: ["/tags", "/tags.html"],
 path: "htmls/tags.ejs",
 showHeader: true,
 showFooter: true,
 content: "tags",
 'Cache-Control': 'max-age=60'
}, {
 nav: true,
 title: "太",
 type: 'html',
 meta: "",
 index: ["/timeline", "/timeline.html"],
 path: "htmls/timeline.ejs",
 showHeader: true,
 showFooter: true,
 content: "timeline",
 'Cache-Control': 'max-age=60'
}, {
 nav: true,
 title: "美",
 type: 'html',
 meta: "",
 index: ["/about", "/about.html"],
 path: "htmls/about.ejs",
 showHeader: true,
 showFooter: true,
 'Cache-Control': 'max-age=60'
}, {
 title: "分类",
 type: 'html',
 meta: "",
 index: ["/type-index", "/type-index.html"],
 path: "htmls/type-index.ejs",
 showHeader: true,
 showFooter: true,
 'Cache-Control': 'max-age=60'
}, {
 title: "标签",
 type: 'html',
 meta: "",
 index: ["/tag-index", "/tag-index.html"],
 path: "htmls/tag-index.ejs",
 showHeader: true,
 showFooter: true,
 'Cache-Control': 'max-age=60'
}, {
 title: "详情页",
 type: 'html',
 meta: "",
 index: ["/artical-detail", "/artical-detail.html"],
 path: "htmls/artical-detail.ejs",
 showHeader: true,
 showFooter: true,
 showType: true,
 showTag: true,
 content: "md",
 'Cache-Control': 'max-age=60'
}]
