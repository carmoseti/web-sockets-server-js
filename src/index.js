const webSocketServerPort = 9000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketServerPort);
const wsServer = new webSocketServer({
    httpServer: server
});

// I'm maintaining all active connections in this object
const clients = {};

// This code generates unique userId for every user.
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wsServer.on('request', function(request) {

    console.log('wsServer Request : ',request);

    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));
    console.log('Clients :', clients);

    // Message from client
    connection.on('message',message=>{
        console.log('connection.onmessage() : ', message);

        // Message to client
        clients[userID].sendUTF('From Server');

    });

    connection.on('close',connection=>{
        console.log('connection.onclose() : ', connection)
    });

});