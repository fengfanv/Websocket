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
