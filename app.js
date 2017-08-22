const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

//
// REF: https://github.com/kljensen/node-sse-example
//
var clientId = 0;
var clients = {};  // <- Keep a map of attached clients

app.get(/list/, function(req, res){
	req.socket.setTimeout(Number.MAX_VALUE);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  (function(clientId){
      clients[clientId] = res; // <- Add this client to those we consider "attached"
      req.on("close", function(){delete clients[clientId]});  // <- Remove this client when he disconnects
  })(++clientId);
});

// TODO change to POST
app.get(/chat/, function(req, res){
  let u = req.query.u;
  let m = req.query.m;
  let d = (new Date()).toLocaleTimeString();
	for (clientId in clients){
    // TODO return json, render from front
		clients[clientId].write(`data: <${d}> [${u}] ${m}\n\n`); // <- Push a message to a single attached client
	};
  res.send('done');
});

app.listen(8080 , function(){
  console.log('public-chat start !')
})
