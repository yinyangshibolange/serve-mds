---
title: dayjs
author: hy
desp: dayjs
time: 2022-12-7 15:20:00
tag: dayjs
banner: https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2dfce242d65465a80a01c7eb56d294e~tplv-k3u1fbpfcp-watermark.image?" alt="20210204411652_oerTjp.jpg
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
<script src="https://unpkg.com/dayjs/dist/dayjs.min.js"></script>
```

## 使用
Day.js提供了一个全局dayjs函数，可以创建一个Day.js实例：

```
const now = dayjs();
```

使用Day.js实例，你可以使用更多的API进行日期和时间的操作：

```
now.add(1, 'month');
now.subtract(7, 'days');
now.startOf('day');
```

此外，你还可以使用Day.js实例格式化日期：

```
now.format('DD/MM/YYYY HH:mm');
```

## 总结
Day.js是一个强大的JavaScript库，可以帮助你轻松处理日期和时间，比Moment.js更轻量级、更快速、更高性能。它提供了一系列API，可以让你轻松操作、格式化日期和时间。
