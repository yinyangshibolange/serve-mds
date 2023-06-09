---
title: 每天学习一个API之Beacon
author: 程序员的快乐生活
desp: 挑选了一些具有较强兼容性的WEB API进行说明。Beacon 用于发送异步和非阻塞请求到服务器
time: 2023-3-20 17:06:00
type: MDN API 
tag: 前端API
banner: http://rqisd4yi1.hd-bkt.clouddn.com/brodchannel.drawio.png
---

# 带密码验证的文档编辑器

## 使用node搭建服务器（静态项目无法对文档进行有效的保护）

## 使用方式一(全局安装)

1. 全局安装
```shell
npm i ssr-md -g
```

2. 创建项目文件夹,任意名称，例如mymd,命令
```shell
mkdir mymd
```

3. 进入文件夹
```shell
cd mymd
```

4. 初始化项目
```shell
ssr-md init
```

可带参数p(path),例如
```shell
ssr-md init -p C:\\
```

5. 运行
```shell
ssr-md start
```

可带参数p(path),例如
```shell
ssr-md start -p C:\\
```

## 使用方法二（局部/项目中安装）

1. 新建项目文件夹
```shell
mkdir mymd
```

2. npm初始化并安装包
```shell
npm init
npm i ssr-md --save
```

3. npx运行ssr-md的init(参数同上)
```shell
npx ssr-md init
```

4. npx运行ssr-md的start(参数同上)
```shell
npx ssr-md start
```

## 效果如下图所示

![image](shot.gif)

## md文件可以文件嵌套

* 比如跳转链接/mds-haha，就是对应【md文件根目录/haha.md文件】

* 比如跳转链接/mds-tech--index，就是对应【md文件根目录/tech/index.md文件】

那么我们就可以在markdown文件中设置链接进行文档的跳转，推荐在主md文件下设置其他md文件的链接目录

## ssr-md.config.js配置解释

| key          | type（类型）         | Description（描述）                         | Default（默认） |
|--------------|------------------|-----------------------------------------|-------------|
| app_port   | number           | 服务监听的端口号                               | 8080          |
| app_screct     | string           | cookie生成所用安全码                        | '_app_sercrect1_'          |
| app_name         | string           | 登录页名称                                   | '我的文档'          |
| logo_src   | string          | 登录页logo                         | ""       |
| favicon   | string          | 网站图标 href                        | "favicon.ico"       |
| max_levels   | number          | 最大标题层数，设置为null则不限制层数，层数限制从h1开始，既如果只有h2，h3，h4且设置了三层，那么只有h2和h3会被设置为标题                         | 3       |
| mds_dir      | string | md目录，默认mds                                 | 'mds'     |
| index_md     | string            | 首页md,默认index                                   | 'index'   |
| need_password     | boolean          | 是否需要密码，才能访问                                  | true       |
| pass_expire        | string           | 可用天和小时，例如'day','hour','30days','12hours','2days'... 设置cookie过期时间            | 'day'   |
| markdown_theme      | string          | md主题,文件路径对应static下的css文件                            | 'themes/github-markdown'       |
| highlight_theme | string           | 代码高亮主题，来自highlight.js主题                   | 'highlight/styles/vs2015.min'   |
| static_fold | string           | 你的静态文件资源站,不要将项目根目录作为静态资源站，会很危险哦                   | ''   |
| custom_css   | string          | md页的自定义css地址(可以是字符串也可以是字符串数组),如果要使用自定义css，则需要设置static_fold（静态资源文件夹），并将css文件放到static_fold对应的文件夹下                        | ''       |
| custom_hi_css        | string         | 登录页的自定义css地址(可以是字符串也可以是字符串数组),如果要使用自定义css，则需要设置static_fold（静态资源文件夹），并将css文件放到static_fold对应的文件夹下 | ''   |
| custom_js        | string         | md页的自定义js地址(可以是字符串也可以是字符串数组),如果要使用自定义js，则需要设置static_fold（静态资源文件夹），并将js文件放到static_fold对应的文件夹下 | ''   |
| custom_hi_js        | string         | 登录页的自定义js地址(可以是字符串也可以是字符串数组),如果要使用自定义js，则需要设置static_fold（静态资源文件夹），并将js文件放到static_fold对应的文件夹下 | ''   |
| admin_password        | string         | 管理员密码，可以进行密码管理，通过修改.passwords文件,必须有管理员cookie | ''   |

可用markdown_theme主题如下：
| key          | 描述         |
|--------------|------------------|
| themes/github-markdown   | github markdown样式           |
| themes/github-markdown-dark     |  github markdown黑暗样式           | 
| themes/github-markdown-light         |  github markdown明亮样式           | 
| themes/jasonm23-dark   | 手机端样式          | 
| themes/jasonm23-foghorn   | 手机端样式          |
| themes/jasonm23-markdown   | 手机端样式          |
| themes/jasonm23-swiss   | 手机端样式          |
| themes/markedapp-byword   | pc/手机端样式          |
| themes/roryg-ghostwriter   | pc/手机端样式          |
| themes/sspai   | pc/手机端样式          |
| themes/thomasf-solarizedcssdark   | pc/手机端样式          |
| themes/thomasf-solarizedcsslight   | pc/手机端样式          |


## 查看帮助(init命令和start命令)

1. ssr-md init --help (全局安装：npx ssr-md init --help)

2. ssr-md start --help (全局安装：npx ssr-md start --help)

## 部署

1. 由于是ssr，那么服务器一定要有node环境
2. linux命令行运行: 执行`ssr-md start`(需要配置ssr-md的环境变量或者找到ssr-md所在目录)


