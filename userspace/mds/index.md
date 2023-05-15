# 带密码验证的文档编辑器

## 密码在userspace/.passwords文件中

## 首页配置在userspace/config.js文件中，可配置name和logo

## markdown文件是userspace/README.md


## 使用方式

1. 安装依赖
```shell
npm i
```

2. 编写userspace/README.md文档

3. 修改文档密码（userspace/.passwords文件）

4. 修改userspace/config.js配置app_name和logo

5. 运行
```shell
node index
或者使用pm2进行管理
```

## markdown链接

<a href="/mds-tech--index" target="_blank">链接到tech/index.md（新标签页）</a>

[链接到haha（当前页面）](/mds-haha)

[webindexdb](/mds-webindexdb)