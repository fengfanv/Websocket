# 使用websocket写一个客服聊天系统

一步一步从认识websocket Api 到实现一个客服聊天系统。

#### 作者：Fengfanv

------

### 第一步 了解实现客服系统要用到的工具
#### 1、服务端**nodejs-websocket**

```javascript
//创建一个websocket服务
var server = ws.createServer(function(connection){

  //给连接的客户端发送字符串讯息
  connection.sendText("字符串");
  
  //给连接的客户端发送二进制数据
  connection.sendBinary(Binary);
  
  //给连接的客户端发送字符串信息或二进制数据
  connection.send();
  
  //收到客户端消息时触发
  connection.on("text",function(str){
    console.log("收到消息："+str);
  });
  
  //客户端关闭连接时触发
  connection.on("close",function(code,reason){
    console.log("连接关闭");
  });
  
  //当连接出现错误时触发
  connection.on("error",function(error){
    console.log(error);
  });
  
});

//设置服务端口号和服务地址
server.listen(host,[host]);

//关闭websocket服务方法
server.close();

//包含所有连接的客户端的数组,可利用它对广播信息
server.connections;

```
#### 2、客户端**websocket**
```javascript
//new WebSocket时客户端向服务端请求连接
var ws=new WebSocket(url);

//连接建立时触发
ws.onopen=function(){
  console.log("连接成功！");
}

//连接关闭时触发
ws.onclose=function(){
  console.log("断开连接！");
}

//客户端接收服务端数据时触发
ws.onmessage=function(e){
  console.log("新消息："+e);
}

//发送消息
ws.send("要发送的消息");

//关闭与服务端的连接
ws.close();

//连接状态
ws.readyState;
/*
readyState
0 - 表示连接尚未建立。
1 - 表示连接已建立，可以进行通信。
2 - 表示连接正在进行关闭。
3 - 表示连接已经关闭或者连接不能打开。
*/

```

### 第二步 结合上面的知识写一个小Demo，跑一下，看看跑的情况

#### 1、服务端安装npm插件**nodejs-websocket**
```
mkdir Websocket                 //创建项目文件夹
cd Websocket                    
npm install nodejs-websocket    //安装nodejs-websocket
```
#### 2、编写demo
服务端 - Node.js
```javascript
var ws = require("nodejs-websocket");
var server = ws.createServer(function (connection) {
	console.log("新连接已连接");
	connection.on("text", function (str) {
		console.log("收到:" + str);
		connection.sendText("服务器" + str + "服务器");
	})
	connection.on("close", function (code, reason) {
		console.log("连接关闭");
	})
});
server.listen(3000, function () {
	console.log('websocket 启动成功！', 3000);
});
```
<h6>服务端代码讲解：</h6>
<p>1、服务端启动成功时，服务端控制台打印`“websocket 启动成功！”`。</p>
<p>2、客户端连接到本服务时，服务端控制台会打印`“新建连接已连接”`。</p>
<p>3、当连接本服务的客户端断开与本服务的连接时，服务端控制台打印`“连接关闭”`。</p>
<p>4、当已连接本服务的客户端发送消息到本服务时，服务端控制台打印`“收到+收到的消息”`，同时会把发送过来的消息拼接成`“服务器+发送过的信息+服务器”`的形式返回到`“发送信息的客户端”`。</p>

客户端 - html
```
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Demo</title>
	</head>
	<body>
		<div>
			<button onclick="turnOnServer()">打开服务</button>
			<button onclick="turnOffServer()">关闭服务</button>
		</div>
		<input id="sendText" type="text" placeholder="消息" />
		<button onclick="send()">发送</button>
		<div id="board"></div><!--显示当前服务连接状态-->
		<script type="text/javascript">
			var ws = null;
			//打开服务
			function turnOnServer() {
				ws = new WebSocket("ws://localhost:3000");
        //当服务连接时运行
				ws.onopen = function() {
					document.getElementById("board").innerHTML = "已连接";
				}
        //当服务断开或关闭时运行
				ws.onclose = function() {
					document.getElementById("board").innerHTML = "已断开";
				}
        //当服务端发来消息时运行
				ws.onmessage = function(data) {
					showMessage(data);
				}
			};
			//关闭服务
			function turnOffServer() {
				ws.close();
			};
			//发送消息
			function send() {
				var txt = document.getElementById("sendText").value;
				ws.send(txt);
			};
			//显示服务器发过来的讯息
			function showMessage(str) {
				var element = document.createElement("div");
				element.innerHTML = str;
				document.body.appendChild(element);
			};
		</script>
	</body>
</html>
```
<h6>客户端代码讲解：</h6>
<p>1、turnOnServer()方法用来启动与服务端的服务连接。</p>
<p>2、turnOffServer()方法用来切断与服务端的连接</p>
<p>3、send()用来把想发送的消息发送到服务端</p>
<p>4、showMessage()用来显示服务端发来的信息</p>

#### 3、
