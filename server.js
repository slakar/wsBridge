#!/usr/bin/env node

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const WebSocket = require('ws');
const url = require('url');

let sockets = [];

const ws = new WebSocket.Server({
  port: 3000,
  clientTracking: true
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3005, () => {
  console.log('listening on *:3005');
});

ws.on('connection', function(socket, incoming_request) {
  let urlParams = url.parse(incoming_request.url, true);

  //sockets.push(socket);
  console.log(`New connection: ${urlParams.query.guid}, Number of Clients: `);

  //Set ID to socket
  socket.id = urlParams.query.guid;

  // When you receive a message, send that message to every socket.
  socket.on('message', function(msg) {

    var jsonMsg = JSON.parse(msg);

    if(jsonMsg.Type == "PING"){
      socket.send(`{\"Sender\":\"NA\",\"Destination\":\"NA\",\"Type\":\"RESPONSE\",\"Instruction\":\"PONG\", \"Data\":\"Client Not Active\"}`);
      return;
    }

    var client_cnt = 0;

    //INVESTIGATE USING FILTER/FIND INSTEAD
    ws.clients.forEach(function each(client) {
      if (client.id == jsonMsg.Destination){
        client_cnt++;
        client.send(String(msg));
      }
    })

    if(client_cnt == 0){
      socket.send(`{\"Sender\":\"NA\",\"Destination\":\"NA\",\"Type\":\"RESPONSE\",\"Instruction\":\"MSG_ID\", \"Data\":\"Client Not Active\"}`);
    }

  });

  socket.on('ping', function(msg) {
    console.log("Ping Received.");
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);

    //sockets.push(socket);
    console.log("Client Disconnected:", socket.id);

  });
});