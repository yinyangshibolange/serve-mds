---
title: 《每天学习一个API之getBoundingClientRect》
author: 程序员的快乐生活
desp: 本节目由流浪的坤少赞助
time: 2023-08-11
tag: 前端API
banner: /uploads/banners/cQfPvyBsYhkAMSHHlVd7nJmG.png


---



# Day.js
Day.js是一个可以让你轻松处理日期和时间的JavaScript库。它的设计目的是取代Moment.js，具有更小的文件大小、更快的速度和更好的性能。

## 安装
你可以通过npm或者CDN安装Day.js：

### NPM
```
$ npm install dayjs
```

### CDN
```
&lt;script src=&#34;https://unpkg.com/dayjs/dist/dayjs.min.js&#34;&gt;&lt;/script&gt;
```

## 使用
Day.js提供了一个全局dayjs函数，可以创建一个Day.js实例：

```
const now = dayjs();
```

使用Day.js实例，你可以使用更多的API进行日期和时间的操作：

```
now.add(1, &#39;month&#39;);
now.subtract(7, &#39;days&#39;);
now.startOf(&#39;day&#39;);
```

此外，你还可以使用Day.js实例格式化日期：

```
now.format(&#39;DD/MM/YYYY HH:mm&#39;);
```

## 总结
Day.js是一个强大的JavaScript库，可以帮助你轻松处理日期和时间，比Moment.js更轻量级、更快速、更高性能。它提供了一系列API，可以让你轻松操作、格式化日期和时间。
