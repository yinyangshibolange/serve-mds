# 带密码验证的文档编辑器

## 使用node搭建服务器（静态项目无法对文档进行有效的保护）



## 使用方式

1. 全局安装
```shell
npm i serve-mds -g
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
serve-mds init
```

可带参数p(path),例如
```shell
serve-mds init -p C:\\
```

5. 运行
```shell
serve-mds start
```


6. 效果如下图所示

![image](static/s1.png)

![image](static/s2.png)


## 查看帮助(init命令和start命令)

1. serve-mds init --help

2. serve-mds start --help

## 部署

1. 由于是ssr，那么服务器一定要有node环境
2. linux命令行运行: 执行`serve-mds start`


## markdown链接

<a href="/mds-tech--index" target="_blank">链接到tech/index.md（新标签页）</a>

[链接到haha（当前页面）](/mds-haha)

[webindexdb](/mds-webindexdb)