---
title: 每天学习一个API之Beacon
author: 程序员的快乐生活
desp: 挑选了一些具有较强兼容性的WEB API进行说明。Beacon 用于发送异步和非阻塞请求到服务器
time: 2023-3-20 17:06:00
tag: 前端API
banner: http://rqisd4yi1.hd-bkt.clouddn.com/brodchannel.drawio.png
---

# Beacon
这个api可以让在页面关闭时，发送一个请求到服务器，由于传统的xhr请求不可靠，不能保证发送成功，所以诞生了这个api，这在某些特殊场景下将会比较实用

食用方法如下：
```javascript
navigator.sendBeacon(url);
navigator.sendBeacon(url, data);
```
`data` 可以是 ArrayBuffer、ArrayBufferView、Blob、DOMString、FormData或 URLSearchParams 类型的数据，数据是通过post请求发送的

注意这个api不能再unload和beforeUnload中使用，因为这两个api在缓存页面关闭时并不会触发，只有当缓存也销毁的时候才会触发，具体查看bfcache机制，比如在页面前进时，当前页面未销毁，而是缓存下来的时候，就不会触发这两个api。

所以还是要看onpagehide和visibilitychange这两个api，而visibilitychange
* visibilitychange当页面隐藏和显示时触发，且当 visibleStateState 属性的值转换为 hidden 时，Safari 不会按预期触发 visibilitychange。
* onpagehide当页面隐藏和显示时不触发，在当前页面离开前往其他页面的时候触发，且有一个persisted参数，表示是否从缓存中获取的

html demo可以到我的gitee仓库下获取
<https://gitee.com/mrhki/web-api-demo.git>
需要打开server下的koa服务器，再打开Beacon demo运行anywhere
