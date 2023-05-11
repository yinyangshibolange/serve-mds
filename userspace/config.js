module.exports = {
 app_port: 9988, // 服务监听的端口号
 app_screct: '_ax33daw_', // cookie生成码
 max_levels: 3, // 最大标题层数，设置为null则不限制层数，层数限制从h1开始，既如果只有h2，h3，h4且设置了三层，那么只有h2和h3会被设置为标题
 // custom_css: "", // 自定义css地址
 app_name: "我的文档",
 logo_src: "", // 首页logo

 mds_dir: "mds", // md目录
 index_md: "index", // 首页md
 need_password: true, // 是否需要登录
 pass_expire: '12days', // 'day','hour','30days','12hours', 设置cookie过期时间
 // todo
 markdown_theme: 'sspai', // md主题,文件路径对应static下的css文件
 admin_password: 'ccc1942q123s', // 管理员密码，可以进行密码管理，通过修改.passwords文件,必须有管理员cookie
 // 密码管理todo，
}