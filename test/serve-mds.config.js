module.exports = {
 app_port:  8080, // 服务监听的端口号
 app_screct: '_app_sercrect1_', // cookie生成码
 max_levels: 3, // 最大标题层数，设置为null则不限制层数，层数限制从h1开始，既如果只有h2，h3，h4且设置了三层，那么只有h2和h3会被设置为标题
 // custom_css: "", // 自定义css地址
 app_name: "我的文档", // 登录页名称
 logo_src: "", // 登录页logo

 mds_dir: "mds", // md目录，需要在文件夹userspace下，默认mds
 index_md: "index", // 首页md,默认index, 默认index
 need_password: true, // 是否需要密码，才能访问
 pass_expire: 'day', // 'day','hour','30days','12hours', 设置cookie过期时间
 markdown_theme: 'themes/thomasf-solarizedcsslight', // md主题,文件路径对应static下的css文件
 highlight_theme: 'highlight/styles/vs.min',
 static_fold: '', // 你的静态文件资源站,不要将项目根目录作为静态资源站，会很危险哦
 // todo
 admin_password: '', // 管理员密码，可以进行密码管理，通过修改.passwords文件,必须有管理员cookie
 // 密码管理todo，暂未实现
}