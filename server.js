var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require("ip");
var fs = require("fs");
//var mongo = require("mongodb").MongoClient;

//connect to mongodb 
/*
var uri = "mongodb+srv://testmann:mYu5lbXjn3ymx2e5@cluster0-bmxsg.mongodb.net/test"
mongo.connect(uri, function(err, client) {
if(err){
	console.log("could not connect");
}
console.log("server connected")
//const db = client.db("test");
*/
var port = process.env.PORT || 12000;
var userArray = [];
var userNameArray = [];

app.get('/', function(req, res){
  //push user to array on page request
  userArray.push(req.ip);
	res.sendFile(__dirname + '/index.html');

});

//connect to socket.io
io.on('connection', function(socket){

 var username = null;
 io.emit("userlist push", userNameArray);



  //var chat = client.collection('chats');

/*
  //create function to send status
  sendStatus = function(s){
  	socket.emit("status", s);
  }

  //get chats from mongo collection
  chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
  	if(err){
  		throw err;
  	}
  	socket.emit("output", res);
  });

  //handle input events
  socket.on("input", function(data){
  	let name = data.name;
  	let message = data.message;

  	//check for name and message
  	if(name == "" || message == ""){
  		//send error status
  		sendStatus("Please send name and message");
  	}else{
  		//insert message into db
  		chat.insert({name: name, message: message}, function(){
  			client.emit("output", [data]);

  			//send status object
  			sendStatus({
  				message: "message sent",
  				clear: true
  			});
  		});
  	}
  });

  //handle clear
  socket.on("clear", function(data){
  	//remove all chats from collection
  	chat.remove({}, function(){
  		socket.emit("cleared")
  	})
  })


*/







  //connection ip variable
  var userIP = socket.handshake.address;
  console.log("Socket connection established: " + userIP);
  
  //logging login
  var d = new Date();
  fs.appendFile("log.txt", d.toLocaleTimeString() + ": 		User connected: 	" + userIP + "\n", function(err){
  	if(err){
  		console.log("error while logging")
  	}
  	console.log("login was logged");
  });

  

  //push userlist to clients
  //io.emit("userlist push", userArray);

  //send chat message
  socket.on('chat message', function(msg){
  	if(username == null){
  		username = msg;
  		msg = username + " has connected";
  		userNameArray.push(username);
  		io.emit("userlist push", userNameArray);
  		io.emit("chat message", msg);
  	}else{
  		var d = new Date();
  		var clientIP = userIP;
  		msg = d.toLocaleTimeString() + ":  " + username + ": " + msg;
    	io.emit('chat message', msg);
    	}


  });

  socket.on("disconnect", function(){
    
    //logging disconnection
    var d = new Date();

  	fs.appendFile("log.txt", d.toLocaleTimeString() + ": 	User disconnected: 		" + userIP + "\n", function(err){
  	if(err){
  		console.log("error while logging")
  	}
  	console.log("Disconnection was logged");
  });

  	//looping through userarray to remove user
    var array = userNameArray;
      for (var i = array.length - 1; i >= 0; --i) {
        if (array[i] == username) {
         array.splice(i,1);
        }
      }
      
    userNameArray = array; 
    io.emit("userlist push", userNameArray);
    console.log("User disconnected from ip:  " + userIP); 

    //push userlist on client request
    socket.on("userlist request", function(){
      io.emit("userlist push", userNameArray);
      console.log("client request approved");
    });

  }); 

});


http.listen(port, function(){
  console.log('listening on *:' + port);
});

/*
  db.close();
});

*/
