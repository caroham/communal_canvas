const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require('mongoose');

let app = express();

app.use(bodyParser.json());
app.use(express.static((path.join(__dirname + '/client/dist'))));

mongoose.connect('mongodb://localhost/canvas_db');

let PathSchema = new mongoose.Schema({
    paths: [{
        prevX: {type: Number},
        prevY: {type: Number},
        currX: {type: Number},
        currY: {type: Number},
        color: {type: String},
        weight: {type: Number}
    }]
}, {timestamps: true});

mongoose.model('Path', PathSchema);

let Path = mongoose.model('Path');


app.get('/paths', function(req, res){
    Path.findOne({}, function(err, paths){
        if(err){
            console.log('returned error', err);
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success", data: paths});
        }
    });
});

app.post('/paths', function(req, res){
    console.log("============ in post, req.body: ", req.body);
    let newPath = new Path({paths: req.body});
    newPath.save(function(err){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success"});
        }
    });
});

app.put('/paths', function(req, res){
    console.log('in put, req.body: ', req.body);
    Path.find({}, function(err, paths){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            let len=paths[0].paths.length + req.body.length;
            console.log("======== len", len);
            if(len>2000) {
                paths[0].paths = [];
            }  
            let newArr = paths[0].paths.concat(req.body);
            paths[0].paths = newArr;
            paths[0].save(function(err){
                if(err){
                    console.log("returned error", err);
                    res.json({message: "Error", error: err});
                } else {
                    res.json({message: "Success"});
                }
            });
        }
    })
})

app.delete('/delete', function(req, res){
    console.log("in delete on server.js");
    Path.remove({}, function(err){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success"});
        }
    });
})



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