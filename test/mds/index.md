# 带密码验证的文档编辑器

## 使用node搭建服务器（静态项目无法对文档进行有效的保护）

## 密码在userspace/.passwords文件中

## 首页配置在userspace/config.js文件中，可配置name和logo

## markdown文件是userspace/README.md


## 使用方式

1. 安装依赖
```
npm i
```

2. 编写userspace/README.md文档

3. 修改文档密码（userspace/.passwords文件）

4. 修改userspace/config.js配置app_name和logo

5. 运行
```
node index
或者使用pm2进行管理
```

6. 效果如下图所示

![image](static/s1.png)

![image](static/s2.png)


## 部署
1. 由于是ssr，那么服务器一定要有node环境，可以使用宝塔面板安装pm2管理器，也可以在宝塔面板网站管理中添加node项目，windows系统请在项目目录下运行node index命令
2. linux命令行运行: 执行`bin/www`


## markdown链接

<a href="/mds-tech--index" target="_blank">链接到tech/index.md（新标签页）</a>

[链接到haha（当前页面）](/mds-haha)

[webindexdb](/mds-webindexdb)