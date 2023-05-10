# 带密码验证的文档编辑器

## 密码在user_namespace/.passwords文件中

## 首页配置在user_namespace/config.js文件中，可配置name和logo

## markdown文件是user_namespace/README.md


## 使用方式

1. 安装依赖
```
npm i
```

2. 编写user_namespace/README.md文档

3. 修改文档密码（user_namespace/.passwords文件）

4. 修改user_namespace/config.js配置app_name和logo

5. 运行
```
node index
或者使用pm2进行管理
```
