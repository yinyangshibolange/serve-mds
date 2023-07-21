---
title: 每天学习一个API之BroadcastChannel
author: 程序员的快乐生活
despircation: 挑选了一些具有较强兼容性的WEB API进行说明。广播对象BroadcastChannel是一个浏览器内置对象，可以实现在同源浏览器下不同tab，窗口，frame，iframe之前进行简单通讯
time: 2023-3-20 15:56:00
type: MDN API 
tag: 前端API
banner: http://rqisd4yi1.hd-bkt.clouddn.com/brodchannel.drawio.png
---

## BroadcastChannel作用

此API实现了在同源浏览器下不同tab，窗口，frame，iframe之前进行简单通讯的功能，是监听者模式设计思想


### 使用方法

新建一个BroadcastChannel对象

```javascript
var channel = new BroadcastChannel('my_channel');
```
  

在需要监听广播的地方监听页面
```javascript
channel.onmessage = function(ev) {
console.log(ev.data)
}
```


### 发送消息

```javascript
channel.postMessage("your message")
```

ps: 可以发送任意类型的数据

  

**断开连接**

channel.close()


## 来个demo测试一下看看

新建三个html文件

  

### 第一个

```html
<body>

<input id="my_input" />

<div id="show_input_value"> </div>

<script>

var channel = new BroadcastChannel("my_channel")

channel.onmessage = function (ev) {

console.log(ev)

document.getElementById("show_input_value").innerText=ev.data
}

document.getElementById("my_input").oninput = function (ev) {

document.getElementById("show_input_value").innerText=this.value

channel.postMessage(this.value)

}

</script>

</body>
```

### 第二个
```html
<body>

<div id="show_input_value"> </div>

<script>

var channel = new BroadcastChannel("my_channel")

  

channel.onmessage = function (ev) {

console.log(ev)

document.getElementById("show_input_value").innerText=ev.data

}

  

</script>

</body>
```

### 第三个

```html
<body>
<iframe id="my_iframe" src="index.html">
</iframe>
</body>
```

  
在目录下运行anywhere，保证三个html在同一个源下
![Snipaste_2023-03-20_15-31-28.png](http://rqisd4yi1.hd-bkt.clouddn.com/Snipaste_2023-03-20_15-31-28.png)

依次打开网址
1.http://ip:port(你的ip和端口)
2.http://ip:port(你的ip和端口，开两个，测试tab标签页的通讯)
3.http://ip:port/test_iframe.html
4.http://ip:port/newchannel.html（用于展示 第二个channel实例是否可以监听）


在一个网页的输入框中随意输入一些内容，
![Snipaste_2023-03-20_16-11-08.png](http://rqisd4yi1.hd-bkt.clouddn.com/Snipaste_2023-03-20_16-11-08.png)

然后查看其他三个网页的内容，显示如下，这只是一个小demo，更多使用场景需要更深入的探索

![Snipaste_2023-03-20_16-11-20.png](http://rqisd4yi1.hd-bkt.clouddn.com/Snipaste_2023-03-20_16-11-20.png)

![Snipaste_2023-03-20_16-11-27.png](http://rqisd4yi1.hd-bkt.clouddn.com/Snipaste_2023-03-20_16-11-27.png)

![Snipaste_2023-03-20_16-11-32.png](http://rqisd4yi1.hd-bkt.clouddn.com/Snipaste_2023-03-20_16-11-32.png)


html demo可以到我的gitee仓库下获取
<https://gitee.com/mrhki/web-api-demo.git>
