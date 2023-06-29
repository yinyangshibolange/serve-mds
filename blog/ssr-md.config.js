module.exports = {
 app_port: 8081, // 服务监听的端口号
 app_screct: '_app_sercrect1_', // cookie生成码
 max_levels: 3, // 最大标题层数，设置为null则不限制层数，层数限制从h1开始，既如果只有h2，h3，h4且设置了三层，那么只有h2和h3会被设置为标题
 app_name: "我的文档", // 登录页名称
 logo_src: "", // 登录页logo
 favicon: "favicon.ico", // 网站图标
 mds_dir: "mds", // md目录，默认mds
 index_md: "index", // 首页md,默认index, 默认index
 need_password: false, // 是否需要密码，才能访问
 pass_expire: 'day', // 'day','hour','30days','12hours', 设置cookie过期时间
 markdown_theme: 'themes/github-markdown', // md主题,文件路径对应static下的css文件
 highlight_theme: 'highlight/styles/vs2015.min', // 代码高亮主题，来自highlight.js主题
 static_fold: 'static', // 你的静态文件资源站,不要将项目根目录作为静态资源站，会很危险哦
 custom_css: "css/md_css", // md页的自定义css地址(可以是字符串也可以是字符串数组),如果要使用自定义css，则需要设置static_fold（静态资源文件夹），并将css文件放到static_fold对应的文件夹下
 custom_hi_css: "", // 登录页的自定义css地址(可以是字符串也可以是字符串数组),如果要使用自定义css，则需要设置static_fold（静态资源文件夹），并将css文件放到static_fold对应的文件夹下
 custom_js: "", // md页的自定义js地址(可以是字符串也可以是字符串数组),如果要使用自定义js，则需要设置static_fold（静态资源文件夹），并将js文件放到static_fold对应的文件夹下
 custom_hi_js: "", // 登录页的自定义js地址(可以是字符串也可以是字符串数组),如果要使用自定义js，则需要设置static_fold（静态资源文件夹），并将js文件放到static_fold对应的文件夹下
 // todo
 admin_password: '', // 管理员密码，可以进行密码管理，通过修改.passwords文件,必须有管理员cookie
 // 密码管理todo，暂未实现

 // 管理员可以对文件进行编辑，也可以编辑网站样式
 tdk: {
  title: "",
  desp: "",
  keywords: ""
 },
 password_index: "auth", // 登录页面index
 htmls: require("./router"),
}