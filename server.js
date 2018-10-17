var express = require('express');
var app = express();
var server = require('http').createServer(app);
// var io = require('socket-io');
var io = require('socket.io').listen(server);
var recastai = require('recastai').default
//var readline = require('readline-sync');
var build = new recastai.build('access_token', 'en')


users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function () {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send message', function (data) {
        build.dialog({ type: 'text', content: data }, { conversationId: 'CONVERSATION_ID' })
            .then(function (res) {
                io.sockets.emit('new message', { msg: data });
                io.sockets.emit('new message', { msg: '<strong>Bot</strong>: '
                +res.messages[0].content });
            })
    
});

socket.on('new user', function (data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
});

function updateUsernames() {
    io.sockets.emit('get users', users);
}
})
