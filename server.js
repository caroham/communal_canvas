const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require('mongoose');

let app = express();

app.use(bodyParser.json());

app.use(express.static((path.join(__dirname + '/client/dist'))));

app.all("*", (req, res, next) => {
    res.sendFile(path.resolve('./client/dist/index.html'))
});

let server = app.listen(8000, function(){
    console.log('running on port 8000');
});

let io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
    console.log('socket connected, id: ', socket.id);

    socket.on('new_move', function(data){
        socket.broadcast.emit('other_move', {data: data});
    });
});