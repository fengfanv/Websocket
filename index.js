var http = require('http');
var express = require('express');
var app = express();
var ws = require("nodejs-websocket");


//demo
var room = [];//聊天室房间
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
		//告知客服和用户已进入房间
		room.forEach(function (item, index) {
			if (item.yonghuName == connection.userName) {
				/**
				 * 发送消息
				 * @param neiRong 消息内容
				 * @param shuiFaDe 谁发的
				 * @param faGeiShui 发给谁
				 */
				//告知用户
				send("客服-" + item.kefuName + "-将为您服务", "系统", connection.userName);
				//告知客服
				send("用户-" + connection.userName + "-已进入房间", "系统", item.kefuName);
				return false;
			};
		});
		console.log("用户-" + connection.userName + "-进入");
	};
	connection.on("text", function (data) {
		var data = JSON.parse(data);
		//发给自己
		send(data.neiRong, connection.userName, connection.userName);

		//转发给别人
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
	connection.on("close", function (code, reason) {
		if (connection.userType == "kefu") {
			//客服退出把房间删除
			room.forEach(function (item, index) {
				if (item.kefuName == connection.userName) {
					//检查房间内是否有正在连接的用户
					if(item.yonghuName.length == 0){
						//没有则删除房间
						room.splice(index, 1);
					}else{
						//有用户，先通知用户客服退出房间，在命令执行用户关闭
						send("客服-"+item.kefuName+"-已退出房间","系统",item.yonghuName);
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
					//系统告知客服用户已退出房间
					/**
					* send(neiRong,shuiFaDe,faGeiShui)发送消息方法
					* @param neiRong 消息内容
					* @param shuiFaDe 谁发的
					* @param faGeiShui 发给谁
					*/
					send("用户-" + connection.userName + "-已退出房间", "系统", item.kefuName);
				}
			});
			console.log("用户-" + connection.userName + "-已退出");
		};

	});
});
server.listen(3000, function () {
	console.log('websocket 启动成功！', 3000);
});


/**
 * 发送消息
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
		//发给指定的人
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

app.use(express.static('./public'));
http.createServer(app).listen(3001);
console.log('http 启动成功！', 3001);