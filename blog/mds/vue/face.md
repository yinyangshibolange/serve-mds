---
title: 面试题
author: hy
despircation: 自搭建静态博客网站，博客文件可直接在项目中通过markdown规则编写
time: 2022-12-7 15:20:00
type: 前端面试题
tag: 前端面试题
banner: https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2dfce242d65465a80a01c7eb56d294e~tplv-k3u1fbpfcp-watermark.image?" alt="20210204411652_oerTjp.jpg
recommend: 1
---

### 要求：

1.         掌握HTML、CSS、JavaScript、ES6、vue 或 react 等前端技术。

2.         熟练使用 git、node、npm、yarn等常用工具或开发环境；

### 前端技术：

#### html部分：

1、块级元素和行内元素有哪些，块级元素和行内元素的区别

块级元素

1)块级元素可以独占一行。

2)块级元素的默认宽度为100%，默认高度由子元素或者内容决定。

3)块级元素的可以设置宽高，内外边距。

4)块级元素可以嵌套块级元素或者行内元素。

行内元素

1)行内元素不能独占一行，多个行内元素共享一行。

2)行内元素的宽高由内容决定。

3)行内元素不能为其设置宽高，垂直方向的内外边距。（设置了浮动的行内元素可以设置宽高和水平方向上的内外边距）

4)行内元素不能嵌套块级元素。

还有一些比较特别的元素叫行内块元素， 兼具行内元素和块级元素的特点，可以设置宽高，在一行内显示，没有默认宽度如img、input、select、textarea、button等。

行内元素

-          a - 锚点；

-          abbr - 缩写；

-          acronym - 首字；

-          b - 粗体(不推荐)；

-          bdo - bidi override；

-          big - 大字体；

-          br - 换行；

-          cite - 引用；

-          code - 计算机代码(在引用源码的时候需要)；

-          dfn - 定义字段；

-          em - 强调；

-          font - 字体设定(不推荐)；

-          i - 斜体；

-          img - 图片；

-          input - 输入框；

-          kbd - 定义键盘文本；

-          label - 表格标签；

-          q - 短引用；

-          s - 中划线(不推荐)；

-          samp - 定义范例计算机代码；

-          select - 项目选择；

-          small - 小字体文本；

-          span - 常用内联容器，定义文本内区块；

-          strike - 中划线；

-          strong - 粗体强调；

-          sub - 下标；

-          sup - 上标；

-          textarea - 多行文本输入框；

-          tt - 电传文本；

-          u - 下划线；

块级元素

-          <address>定义地址

-          <caption>定义表格标题

-          <dd>定义列表中定义条目

-          <div>定义文档中的分区或节

-          <dl>定义列表

-          <dt>定义列表中的项目

-          <fieldset>定义一个框架集

-          <form>创建 HTML 表单

-          <h1>定义最大的标题

-          <h2>定义副标题

-          <h3>定义标题

-          <h4>定义标题

-          <h5>定义标题

-          <h6>定义最小的标题

-          <hr>创建一条水平线

-          <legend>元素为

-          <fieldset>元素定义标题

-          <li>标签定义列表项目

-          <noframes>为那些不支持框架的浏览器显示文本，于 frameset 元素内部

-          <noscript>定义在脚本未被执行时的替代内容

-          <ol>定义有序列表

-          <ul>定义无序列表

-          <p>标签定义段落

-          <pre>定义预格式化的文本

-          <table>标签定义 HTML 表格

-          <tbody>标签表格主体（正文）

-          <td>表格中的标准单元格

-          <tfoot>定义表格的页脚（脚注或表注）

-          <th>定义表头单元格

-          <thead>标签定义表格的表头

-          <tr>定义表格中的行

2、input表单控件的value和placeholder属性有什么区别

3、H5的本地存储有哪些，有何区别

sessionStorage生命周期为当前窗口或标签页

4、同源策略是什么

协议+域名+端口不相同，则浏览器会爆出异常

-          同源策略，它是由Netscape提出的一个著名的安全策略。

-          当一个浏览器的两个tab页中分别打开来 百度和谷歌的页面

-          当浏览器的百度tab页执行一个脚本的时候会检查这个脚本是属于哪个页面的，

-          即检查是否同源，只有和百度同源的脚本才会被执行。 [1]

-          如果非同源，那么在请求数据时，浏览器会在控制台中报一个异常，提示拒绝访问。

-          同源策略是浏览器的行为，是为了保护本地数据不被JavaScript代码获取回来的数据污染，因此拦截的是客户端发出的请求回来的数据接收，即请求发送了，服务器响应了，但是无法被浏览器接收。

5、跨域是什么？如何解决跨域问题

JSONP

JSONP 是服务器与客户端跨源通信的常用方法。最大特点就是简单适用，兼容性好（兼容低版本IE），缺点是只支持get请求，不支持post请求。

核心思想：网页通过添加一个script元素，向服务器请求 JSON 数据，服务器收到请求后，将数据放在一个指定名字的回调函数的参数位置传回来。

设置document.domain解决无法读取非同源网页的 Cookie问题

因为浏览器是通过document.domain属性来检查两个页面是否同源，因此只要两个页面通过设置相同的document.domain，两个页面就可以共享Cookie（此方案仅限主域相同，子域不同的跨域应用场景。）

CORS

CORS 是跨域资源分享（Cross-Origin Resource Sharing）的缩写。它是 W3C 标准，属于跨源 AJAX 请求的根本解决方法。

1、 普通跨域请求：只需服务器端设置Access-Control-Allow-Origin

2、带cookie跨域请求：前后端都需要进行设置，前端设置根据xhr.withCredentials字段判断是否带有cookie，后端Java还可以使用springMVC的@CrossOrigin

nginx代理跨域

ginx模拟一个虚拟服务器，因为服务器与服务器之间是不存在跨域的。

发送数据时 ，客户端->nginx->服务端；返回数据时，服务端->nginx->客户端。

6、怎么判断图片是否加载完成

#### Css部分

1、布局方式

流式布局 一个一个往下排

自适应布局 适应窗口大小变化大小，百分数，flex

响应式布局 响应窗口的大小进行动态布局，媒体查询

弹性布局 flex，常用css属性

2、盒子模型 从外到内 content+padding+border+margin

3、如何放入一张与原图相同长宽比以及不被裁剪的图片img

4、如何将一个不知长宽的div用absolute方式进行居中

5、Css框架有哪些

6、伪类和伪元素

伪类

a:link{background-color:pink;}/品红，未访问/

a:visited{color:orange;}/字体颜色为橙色，已被访问/

a:focus{background-color:lightgrey;}/浅灰，拥有焦点/

a:hover{background-color:lightblue;}/浅蓝，鼠标悬停/

a:active{background-color:lightgreen;}/浅绿，正被点击/

伪元素

::after (:after) 在选中元素中创建一个后置的子节点

::before (:before) 在选中元素中创建一个前置的子节点

::first-line (:first-line) 选取文字块首行字符

::first-letter (:first-letter) 选取文字块首行首个字符

::selection 选取文档中高亮(反白)的部分

::placeholder 选取字段的占位符文本(提示信息)

::grammar-error 选取被 UA 标记为语法错误的文本

::spelling-error 选取被 UA 标记为拼写错误的文本

::marker 选取列表自动生成的项目标记符号

::cue (:cue) 匹配所选元素中 WebVTT 提示

::backdrop 匹配全屏模式下的背景

::slotted() 用于选定那些被放在 HTML模板 中的元素

::inactive-selection 选取非活动状态时文档中高亮(反白)的部分

7、什么是CSS Sprite（“精灵图”）

CSS Sprites叫 CSS精灵或者雪碧图，是一种网页图片应用处理方式。

CSS Sprites其实就是把网页中一些背景图片整合到一张图片文件中。

再利用CSS的"background-image"，“background-repeat”，"background-position"的组合进行背景定位，background-position可以用数字精确的定位出背景图片的位置。

7、使用CSS Sprite有什么好处

8、清除浮动常用方式

Overflow:hidden;和::after伪元素clear:both

9、怎么写弹性布局

10、Css预处理器有哪些

Stylus,less,sass

#### Js部分：

1、事件冒泡的各个阶段

从上往下捕获阶段（如何捕获） ---> 2：找到目标阶段 ---> 3：从下网上冒泡阶段（如何冒泡）

2、数据类型

五种基本类型: Undefined、Null、Boolean、Number和String。

一种引用数据类型：object

在引用数据类型 object 中包括function/array/object

ES6新增：Symbol，主要用于创建一个独一无二的标识。

ES10新增：Bigint，解决js中精度问题

2、数组去重？

3、数组拉平函数

4、判断变量是否是数组

5、this 指向最后一次调用这个方法的对象

6、如何改变this指向，call、apply、bind

-          call经常做继承 call 写多个参数

-          apply 经常和数组有关，比如实现数组中的最大值，最小值等 apply传数组

-          bind 不调用函数，但是还是想改变this指向，比如改变定时器内部的this指向。

7、浅拷贝和深拷贝，如何实现深拷贝

8、let const区别

9、Es6模块化的导入导出方式

10、.判断数据类型的方法

typeof：无法判断null，是obj类型，而且只能判断出是引用类型

instanceof：

constructor：null和undefined是无效的对象，因此是不会有constructor存在的，这两种类型的数据需要通过typeof来判断。

Object.prototype.toString ：Object.prototype.toString.call(undefined) ;

11、防抖和节流是什么

12、js的异步编程模式有哪些

-          回调函数

-          Promise

-          Async/await

-          发布/订阅模式

-          Generator

#### Vue部分：

2、Create和mounted区别，

    1）created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。

    2）mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。

4、Spa是什么

5、Mvvm都代表什么,用你的理解说说看？将模型(M）与视图（V）用“驱动桥梁”（Vm）搭建起来，达到数据驱动视图的目的

6、双向绑定？Vue2与vue3的双向绑定的区别

7、watch是什么怎么用

8、Mixin是什么，有什么用

9、vue的生命周期

10、Restful接口有哪些？ POST,GET,PUT,DELETE,HEAD,PATCH，OPTIONS

11、Vue组件通信有哪些方式

l  props / $emit

l  ref / $refs父组件定义

l  eventBus事件总线（$emit / $on）

l  依赖注入（provide / inject）这种方法通过一个空的 Vue 实例作为中央事件总线（事件中心）,用它来（ e m i t ） 触 发 事 件 和 （ emit）触发事件和（ emit）触发事件和（on）监听事件，巧妙而轻量地实现了任何组件间的通信。

l  $parent / $children

l  $attrs / $listeners

12、如何让CSS只在当前组件中起作用？

Scoped

13、如何去掉#号

在vue-router配置mode为history

14、v-if和v-show的区别

V-if中变量不为true时dom中不会生成该节点，而v-show同样情况下会生产dom节点，只是将display:none

#### 项目部分：

1、使用的框架，技术栈

2、在实际项目中扮演什么角色

3、项目有哪些模块，涉及那些业务

4、遇到的问题。

4、项目是否做过优化，包括了代码、开发效率、性能、体验等相关领域。

4、如果让你从头搭建一个项目，你会考虑哪些东西？

选框架，权限模块，菜单配置，登录模块，复用模块，复用组件，样式库，组件库，字体库，工具库，业务与用户群，浏览器兼容性，安全性，性能，团队代码质量eslint，是否需要ssr等等

5、前端如何模拟后端接口，

可以mock.js来模拟后端接口

#### 个人部分：

//自我介绍（开头）

//对未来的职业规划

//有什么想问的
