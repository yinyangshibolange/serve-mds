# webindexeddb

![展示图](https://yinyangshibolange.github.io/webindexeddb/webide.png)

- 持久化模拟数据库对象存储，可配合mockjs实现大数据量的数据模拟，可以解决storage可用存储空间小的问题，可以保存图片数据
- 当前版本：v1.0.0

## 安装方式

1. npm/yarn方式安装
```shell
npm install webindexeddb --save
or  
yarn add webindexeddb  
```

2. cdn方式
```html
<script src="https://cdn.jsdelivr.net/gh/yinyangshibolange/webindexeddb/lib/bundle.umd.min.js"></script>  
```

## demo
demo仓库地址：<https://github.com/yinyangshibolange/webindexeddb>

在线预览地址：<https://yinyangshibolange.github.io/webindexeddb/demo.html>

## IndexdbStore配置项
| key     | type（类型） | Description（描述） | Default（默认）     |
|---------|----------|-----------------|-----------------|
| name    | String   | 数据库名称           | 'indexeddbname' |
| version | Number   | 数据库版本           | 1               |
| stores  | Array    | 数据库表初始化配置       | []              |

### stores表配置
| key     | type（类型） | Description（描述） | Default（默认） |
|---------|----------|-----------------|-------------|
| storeName    | String   | 表名              | ''          |
| mainKey | String   | 主键              | 'id'        |
| indexs  | Array    | 索引配置            | []   |

### indexs索引配置
| key     | type（类型） | Description（描述）       | Default（默认） |
|---------|----------|-----------------------|-------------|
| name    | String   | 索引名                   | ''          |
| keyPath | String   | 索引字段，多个字段用","分割       | ''          |
| params  | Object   | 索引配置,可设置索引类型,例如unique | {}          |

## 使用方法
1. 在html原生js使用方式
```html  
<script src="https://cdn.jsdelivr.net/gh/yinyangshibolange/webindexeddb/lib/bundle.umd.min.js"></script>
<body>
<div id="ctx_menu"></div>
</body>
<script>
    var indexedStore = new window.IndexdbStore({
        name: "myindexdb", // 你的indexdb数据库名称
        version: 7, // 如果修改了options里的stores参数，那么必须修改version版本号，不然stores的修改不会生效
        stores: [
            { // 类似数据库表
                storeName: "demoStore",
                // mainKey: 'id', // 主键,默认为id
                // indexs: []
            },
            { // 类似数据库表
                storeName: "imageList",
                // mainKey: 'id', // 主键,默认为id
                indexs: [{
                    name: "parentid", // 索引名称
                    keyPath: "parentid", // 索引字段
                    params: {
                        unique: false,
                    }
                }]
            }
        ]
    })

</script> 
```  
2. 模块化导入方式
```javascript
import IndexdbStore from "webindexeddb"
const indexedStore = new IndexdbStore({
    name: "myindexdb", // 你的indexdb数据库名称
    version: 7, // 如果修改了options里的stores参数，那么必须修改version版本号，不然stores的修改不会生效
    stores: [
        { // 类似数据库表
            storeName: "demoStore",
            // mainKey: 'id', // 主键,默认为id
            // indexs: []
        },
        { // 类似数据库表
            storeName: "imageList",
            // mainKey: 'id', // 主键,默认为id
            indexs: [{
                name: "parentid", // 索引名称
                keyPath: "parentid", // 索引字段
                params: {
                    unique: false,
                }
            }]
        }
    ]
})
```
### IndexdbStore对象包含4个属性

- name 
- version
- stores

上面3个属性已在上方列出

- db （IndexedDB对象，无需使用）

### IndexdbStore对象包含10个数据库操作函数

| functionName | desciption(描述)                                                   | params（参数）                                             | 
|--------------|------------------------------------------------------------------|--------------------------------------------------------|
| addItem      | 新增数据,自动添加addtime和addtimeformat字段,会自动添加\[mainKey\](主键)字段          | storeName, data                                        |
| addBatch     | 批量新增数据,自动添加addtime和addtimeformat字段,会自动添加\[mainKey\](主键)字段        | storeName, list                                        |
| updateItem   | 修改数据，会自动添加updatetime和updatetimeformat                            | storeName, data                                        |
| updateBatch  | 批量修改数据，会自动添加updatetime和updatetimeformat                          | storeName, list                                        |
| delItem      | 删除数据,id是主键值，不一定是id                                               | storeName, id                                          | '
| delBatch     | 批量删除数据,id是主键值，不一定是id                                             | storeName, ids                                         |
| getAll       | 查询表中所有数据                                                         | storeName, sortParams = []                             | 
| queryAll     | 条件查询数据                                                           | storeName, params, sortParams = []                     |
| queryPage    | 条件查询分页数据                                                         | storeName, params, sortParams, page = 1, pagesize = 10 |
| rebuild      | 数据库动态升级重构，当name,version,stores修改后调用，options同构造函数参数，但可为空，默认使用当前参数 | options                                                | 


## 代码打包工具rollup
