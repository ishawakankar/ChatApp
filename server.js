var express = require('express');
var app = express();
var server = require('http').createServer(app);
// var io = require('socket-io');
var io = require('socket.io').listen(server);
// var recastai = require('recastai').default
//var readline = require('readline-sync');
// var build = new recastai.build('access_token', 'en')

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

    socket.on('connect', function(data){
    	console.log('called connect')
    	updateCurrentUser();
    })

    socket.on('disconnect', function () {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets disconnected', connections.length);
    });

    socket.on('send message', function (data) {
        // build.dialog({ type: 'text', content: data }, { conversationId: 'CONVERSATION_ID' })
        //     .then(function (res) {
                var name=socket.username;
                console.log('inside message loop');
                console.log('name: ',name);
                io.sockets.emit('new message', { msg: '<strong>'+name+'</strong>: '+data });
                // io.sockets.emit('new message', { msg: '<strong>Bot</strong>: '
                // +res.messages[0].content });

//     .catch((error) => {
//     console.log(error)
//     // console.log(error.response.body.errors[0].message)
// })
    
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

function updateCurrentUser() {
	io.sockets.emit('get current user',socket.username);
}
})
