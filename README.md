# 使用websocket写一个客服聊天系统

![](/images/websocket-home.png)
![](/images/websocket-room.png)

#### 一步一步从认识websocket Api 到实现一个客服聊天系统。
#### 作者：Fengfanv

------
#### 以下指导代码除了“小Demo”块代码可直接粘贴使用，剩下的不建议粘贴使用，建议使用下载的项目代码。

## 第一步 技术栈

> 1、Node.js

> 2、nodejs-websocket

> 3、express

#### 1、服务端nodejs-websocket的使用
```javascript
//引入nodejs-websocket
var ws = require('nodejs-websocket');

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
#### 2、客户端websocket的使用
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

## 第二步 运行小Demo测试nodejs-websocket

#### 1、服务端安装nodejs-websocket

```               
npm install nodejs-websocket    //安装nodejs-websocket
```

#### 2、编写Demo

**服务端**

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

<h6>讲解：</h6>

1、服务端启动成功时，服务端控制台打印 “websocket 启动成功！”。

![](/images/websocket-1.png)

2、客户端连接到本服务时，服务端控制台会打印 “新建连接已连接”。

![](/images/websocket-2.png)

3、当连接本服务的客户端断开与本服务的连接时，服务端控制台打印 “连接关闭”。

![](/images/websocket-3.png)

4、当已连接本服务的客户端发送消息到本服务时，服务端控制台打印 “收到+收到的消息” ，同时会把发送过来的消息拼接成 “服务器+发送过的信息+服务器” 的形式返回到 “发送信息的客户端” 。

![](/images/websocket-4.png)
![](/images/websocket-4-1.png)

**客户端**
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
					showMessage(data.data);
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

<h6>讲解：</h6>

1、turnOnServer()方法用来启动与服务端的服务连接。

2、turnOffServer()方法用来切断与服务端的连接

3、send()用来把想发送的消息发送到服务端

4、showMessage()用来显示服务端发来的信息

<h6>运行效果图</h6>

![](/images/websocket-5.png)

#### 3、运行Demo后遇到的问题

<h6>问题：</h6>

当就一个用户连接时服务时，这个用户发送信息服务器可以返回给发送这个用户。但是当多个用户都连接这个服务时，其中一个用户A发消息理论上应该连接的所有人都能看见，但是现实只有用户A自己收到了从服务器处理后的消息。

![](/images/websocket-6.png)

<h6>为什么：</h6>

翻看文档发现，每当一个用户连接nodejs-websocket创建的服务时，服务都会为这个用户创建一个环境，每个用户的环境不同，所以这就是为啥当一个用户发送消息时只有发送人收到了服务器返回的消息，当然nodejs-websocket解决了这个问题为使用者添加了connections属性，这个属性已数组的形式连接着每一个用户的环境，这样通过遍历数组就可以给所有用户发送想发送的消息了。

<h6>解决问题：</h6>

1、在服务端写一个方法，遍历用户给每一个发送消息
```javascript
function send(str) {
	//遍历每个用户，并把要要发送的信息发送给被遍历的每个用户
	server.connections.forEach(function (connection) {
		connection.sendText(str);
	})
}
```

2、将服务端监听text方法内容替换成以下内容
```javascript
connection.on("text", function (str) {
	console.log("收到:" + str);
	//connection.sendText("服务器" + str + "服务器");   旧
	send("服务器" + str + "服务器")				//新
})
```

3、解决后运行效果

![](/images/websocket-7.png)

## 第三步 设计与编写客服聊天系统

看到这里，我们已经了解了websocket的使用，现在我们结合知识设计一个客服聊天系统，让我们更深入的学习和使用websocket。

#### 1、客服聊天系统业务流程图

![](/images/websocket-8.jpg)

#### 2、客服聊天系统业务流程

上面**用户**像**服务器**请求人工服务，**服务器**会查询当前在线的**客服人员**，如果有空闲的**客服**，则会为**用户**连接**客服**，如果没有空闲**客服**则会像**用户**返回信息，告知**用户**暂无**客服**。

#### 3、编写代码

**服务端**

1、根据上一步学习与认识，我们已经知道每当一个用户连接websocket服务后，nodejs-websocket都会为用户生成（返回）一个独立的环境，利用这特点我们可以为每个用户设置一些用来区分不同连接用户的信息。

```javascript
var ws = require("nodejs-websocket");
var server = ws.createServer(function (connection) {
	//为每个连接的用户设置各自信息
	var params = new URLSearchParams(connection.path.replace("/?",""));
	//connection.path返回的是客户端new Websocket(地址)时括号内的地址参数
	connection.userName = params.get("name") || "";
	connection.userType = params.get("type") || "";
});
```

2、根据上面业务流程图，用户请求连接客服人员成功后，用户会被接入客服人员所在的房间，操作完返回客户端（用户），告知用户可以连接websocket服务。

<h6>安装express框架</h6>

```
npm install express
```

<h6>业务代码</h6>

```javascript
var http = require('http');
var express = require('express');
var app = express();

//聊天房间，每一个客服就是一个房间，每个房间的区别就是有没有用户
var room = [];

//接口，查询是否有空闲的房间(客服)
//用户查询是否有空闲客服
app.get('/getroom', function (req, res) {
	var userName = req.query.userName;
	//检查是否有房间是空的,如果为空则把用户拉进房间。
	room.forEach(function (item, index) {
		if (item.yonghuName.length == 0) {
			item.yonghuName = userName;
			res.send({ "room": true, "kefuName": item.kefuName });
			return false;
		}
	});
	//没有房间返回false
	res.send({ "room": false });
});

//创建http服务
http.createServer(app).listen(3001);

```

3、连接websocket服务,根据业务需求连接websocket的用户，有两种身份，一个是客服（kefu），一个是普通用户（yonghu），客服要服务用户，所以客服本身就是一个房间，客服一上线就出现一个房间，普通用户需要做的是就是进入房间与退出房间。

```javascript
var ws = require("nodejs-websocket");

//聊天房间，每一个客服就是一个房间，每个房间的区别就是有没有用户
var room = [];

var server = ws.createServer(function (connection) {
	//为每个新连接的用户设置信息
	var params = new URLSearchParams(connection.path.replace("/?",""));
	connection.userName = params.get("name") || "";
	connection.userType = params.get("type") || "";
	
	if (connection.userType == "kefu") {
		//客服进入，创建一个空房间
		room.push({
			"kefuName": connection.userName,
			"yonghuName": ""
		});
		console.log("客服-" + connection.userName + "-进入");
	} else if (connection.userType == "yonghu") {
		//检索用户在哪个房间，告知客服用户已进入房间
		room.forEach(function (item, index) {
			if (item.yonghuName == connection.userName) {
				/**
				* 发送消息
				* @param neiRong 消息内容
				* @param shuiFaDe 谁发的
				* @param faGeiShui 发给谁
				*/
				//告知用户那个客服将为为他服务
				send("客服-" + item.kefuName + "-将为您服务", "系统", connection.userName);
				//告知客服用户已进入房间
				send("用户-" + connection.userName + "-已进入房间", "系统", item.kefuName);
				return false;
			};
		});
		console.log("用户-" + connection.userName + "-进入");
	};
});

```

4、断开与websocket的服务，因为客服本身就是一个房间，所以客服断开websocket就是删除一个房间，用户断开websocket就是与连接的客服断开，从客服的房间内删除用户。

```javascript
var ws = require("nodejs-websocket");

//聊天房间，每一个客服就是一个房间，每个房间的区别就是有没有用户
var room = [];

var server = ws.createServer(function (connection) {
	/*监听用户连接websocket代码
		...
	*/
   
   //监听用户和客户断开websocket服务
	connection.on("close", function (code, reason) {
		if (connection.userType == "kefu") {
			//客服退出把房间删除
			room.forEach(function (item, index) {
				if (item.kefuName == connection.userName) {
					//检查房间内是否有正在连接的用户
					if(item.yonghuName.length == 0){
						//没有则直接删除房间
						room.splice(index, 1);
					}else{
						/**
						* send(neiRong,shuiFaDe,faGeiShui)发送消息方法
						* @param neiRong 消息内容
						* @param shuiFaDe 谁发的
						* @param faGeiShui 发给谁
						*/
						//有用户，先通知用户客服退出房间，在命令执行用户关闭
						send("客服-"+item.kefuName+"-已退出房间","系统",item.yonghuName);
						//命令执行退出
						send("close","code",item.yonghuName);
					}
				}
			});
			console.log("客服-" + connection.userName + "-已退出");
		} else if (connection.userType == "yonghu") {
			//用户退出就把用户从房间删除
			room.forEach(function (item, index) {
				if (item.yonghuName == connection.userName) {
					item.yonghuName = "";
					/**
					* send(neiRong,shuiFaDe,faGeiShui)发送消息方法
					* @param neiRong 消息内容
					* @param shuiFaDe 谁发的
					* @param faGeiShui 发给谁
					*/
					//系统告知客服用户已退出房间
					send("用户-" + connection.userName + "-已退出房间", "系统", item.kefuName);
				}
			});
			console.log("用户-" + connection.userName + "-已退出");
		};
	});
});
```

5、用户通过websocket与客服沟通，这个项目里用户与客服沟通，就是把房间内对方的消息发给另一个人，所以在传递信息时有三个要素，1传递内容，2谁发的，3发给谁。

```javascript
var ws = require("nodejs-websocket");

//聊天房间，每一个客服就是一个房间，每个房间的区别就是有没有用户
var room = [];

/**
 * 发送消息方法
 * @param neiRong 消息内容
 * @param shuiFaDe 谁发的
 * @param faGeiShui 发给谁
 */
function send(neiRong,shuiFaDe,faGeiShui) {
	var data = JSON.stringify({
		"neiRong": neiRong,
		"shuiFaDe": shuiFaDe
	});
	if (faGeiShui != "all") {
		//发给指定的人，检索连接信息看谁与方法入参一样，一样就发给那个人
		server.connections.forEach(function (connection) {
			if (connection.userName == faGeiShui) {
				connection.sendText(data);
			};
		});
	} else {
		//发给全部的人
		server.connections.forEach(function (connection) {
			connection.sendText(data);
		});
	}
};


var server = ws.createServer(function (connection) {
	/*监听用户连接websocket代码
		...
	*/
   
	/*监听用户退出websocket代码
		...
	*/
   
	//监听用户发消息
	connection.on("text", function (data) {
		var data = JSON.parse(data);
		//发给自己，让自己的聊天界面也显示
		send(data.neiRong, connection.userName, connection.userName);
	
		//发给别人
		if (connection.userType == "kefu") {
			//客服发消息，转发给用户
			room.forEach(function (item, index) {
				if (item.kefuName == connection.userName) {
					var yonghuName = item.yonghuName;
					send(data.neiRong, connection.userName, yonghuName);
				};
			});
		} else if (connection.userType == "yonghu") {
			//用户发消息，转发给客服
			room.forEach(function (item, index) {
				if (item.yonghuName == connection.userName) {
					var kefuName = item.kefuName;
					send(data.neiRong, connection.userName, kefuName);
				};
			});
		};
	});
});

```

**客户端**

1、写完服务端，我们已经知道了这套客服聊天系统业务流程，客户和用户两种身份还是有点区别的，客服本身就是个房间，区别就是房间内有没有用户，所以客服上线时就要连接websocket创建房间等待用户连接。

```javascript
//客服聊天系统首页界面
var elementShouye = document.getElementById("shouye");
//客服聊天系统聊天室界面
var elementLiaotianshi = document.getElementById("liaotianshi");
//聊天室元素
var elementNeirong = document.getElementById("neirong");

var ws = null;
var userType = "kefu";//用户身份，yonghu或kefu
var userName = "";//用户名

//打开websocket服务方法
function turnOnServer() {
	//获取用户名
    userName = document.getElementById("inputUserName").value;
	//连接websocket服务
    ws = new WebSocket("ws://localhost:3000?type=" + userType + "&name=" + userName);
	//监听连接websocket服务
    ws.onopen = function () {
        console.log("已连接websocket服务！");
        //首页关闭
        elementShouye.style.display = "none";
		//打开聊天室
        elementLiaotianshi.style.display = "block";
		//清空聊天内容
        while (elementNeirong.hasChildNodes()) {
            elementNeirong.removeChild(elementNeirong.firstChild);
        }
	}
	//监听与websocket服务断开连接
    ws.onclose = function () {
        console.log("已断开websocket服务！");
        //显示首页，关闭聊天室
        elementShouye.style.display = "block";
        elementLiaotianshi.style.display = "none";
    }
	//监听websocket消息
    ws.onmessage = function (data) {
        var message = JSON.parse(data.data);
		/**
		* 渲染聊天内容
		* neiRong 消息内容
		* shuiFaDe 谁发的
		*/
        showMessage(message.neiRong, message.shuiFaDe);
    }
}
```

2、客服上线后等待用户连接，所以用户端是先查询有没有空闲房间，在启动websocket服务。
```javascript
//用户获取是否用空闲房间
function getroom(){
	//获取用户
    userName = document.getElementById("inputUserName").value;
    $.ajax({
        type:'get',
        url:"http://localhost:3001/getroom",
        data:{
            "userName":userName
        },
        dataType:"json",
        success:function(data){
            if(data.room){
                //有空闲房间
                //启动websocket服务
                turnOnServer();
            }
        },
        error:function(xhr){
            console.log("error:"+xhr.status);
		}
    })
}

```

3、这套系统最最主要的职能“沟通”，要写一个显示消息的方法。因为客服和用户聊天界面基本一样，显示内容也不是很复杂，所以要写一个兼容客服和用户显示聊天内容的方法。

```javascript
//客服聊天系统首页界面
var elementShouye = document.getElementById("shouye");
//客服聊天系统聊天室界面
var elementLiaotianshi = document.getElementById("liaotianshi");
//聊天室元素
var elementNeirong = document.getElementById("neirong");
/**
 * 显示消息
 * neiRong 显示内容
 * shuiFade 谁发的
*/
function showMessage(neiRong, shuiFade) {
    var elementDiv = document.createElement("div");
    var elementSpan = document.createElement("span");
    elementSpan.innerHTML = shuiFade;
    var elementP = document.createElement("p");
    elementP.innerHTML = neiRong;
    if (shuiFade == userName) {
		//显示自己发的消息（自己的消息显示在右边）
		elementSpan.className = "text_align_right";
        elementP.className = "text_align_right";
        if (userType == "kefu") {
            elementDiv.className = "clearfix kefu_xiaoxi";
        } else if (userType == "yonghu") {
            elementDiv.className = "clearfix yonghu_xiaoxi";
        }
    } else {
        //显示别人发过来的消息（别人的消息显示在左边）
        if (shuiFade == "系统") {
            //设置系统消息样式
            elementDiv.className = "clearfix xitong_xiaoxi";
        } else {
            //不是系统消息样式，用户或客服
            if (userType == "kefu") {
                //如果当前身份是客服则设置用户消息样式
                elementDiv.className = "clearfix yonghu_xiaoxi";
            } else if (userType == "yonghu") {
                //如果当前身份是用户则设置客服消息样式
                elementDiv.className = "clearfix kefu_xiaoxi";
            }
        }
    }
    elementDiv.appendChild(elementSpan);
    elementDiv.appendChild(elementP);
    elementNeirong.appendChild(elementDiv);
}
```

4、退出聊天室，关闭websocket服务。
```javascript
//关闭服务
function turnOffServer() {
    ws.close();
}
```

5、发送消息。

```javascript
//发送消息
function send() {
    var txt = document.getElementById("sendText").value;
    ws.send(JSON.stringify({ "neiRong": txt }));
}
```

## 第四步 运行客服聊天系统

为了业务流程的清晰，我已经把用户和客服分别写在了两个不同页面。用户（yonghu.html），客服（kefu.html）

#### 1、下载代码在项目根目录命令行运行

```
node index
```

<h6>启动成功后显示</h6>

```
http 启动成功！ 3001
websocket 启动成功！ 3000
```

#### 2、使用

<h6>打开浏览器分别在浏览器输入如下地址</h6>

```
//客服页面地址
http://localhost:3001/kefu.html

//用户页面地址
http://localhost:3001/yonghu.html
```

<h6>访问成功后客服和用户在首页面设置名称后点击“连接”按钮</h6>

![](/images/websocket-home.png)

<h6>连接成功后分别进入到各自的聊天室界面开始聊天</h6>

![](/images/websocket-room.png)