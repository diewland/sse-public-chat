const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser');

// route public folder as root
app.use(express.static(path.join(__dirname, 'public')))

// support json request
app.use(bodyParser.json());

// sse variables
var clientId = 0;
var clients = {}; // keep a map of attached clients

// attach response for each client
app.get(/list/, function(req, res){
	req.socket.setTimeout(Number.MAX_VALUE); // no timeout
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  (function(clientId){
      clients[clientId] = res; // add this client to those we consider "attached"
      req.on("close", function(){delete clients[clientId]});  // remove this client when he disconnects
  })(++clientId);
});

// broadcast message to all clients
app.post(/chat/, function(req, res){
  var user = req.body.user;
  var msg  = req.body.msg;
  var time = (new Date()).toLocaleTimeString();
	for (clientId in clients){
    var json_data = JSON.stringify({
      user: user,
      msg:  msg,
      time: time,
    });
    // push a message to a single attached client
		clients[clientId].write('data: '+ json_data +'\n\n');
	};
  res.send('ok');
});

// start web server port 8080
app.listen(8080 , function(){
  console.log('public-chat start !')
})
