var express = require('express');
var app = express();
var  serv = require('http').Server(app);

app.get('/', function(req,res){
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 1453);

console.log('Server Started');

var Sockets = [];

var io = require('socket.io')(serv,{});
var cnt=0,started=false,both_ready=false,turn_changed=false,turn=0,vis=[];

io.sockets.on('connection', function(socket){
    socket.id=cnt;
    cnt++;
    console.log('connection'+socket.id);
    socket.ready=false;
    Sockets.push(socket);
    socket.emit('restart');
    socket.on('ready',function(data){
        if(!socket.ready){
            socket.ready=true;
            socket.map=data;
        }
    });
    socket.on('move_made',function(data){
        turn_changed=true;
        vis=data;
    });
    socket.on('disconnect',function(){
        console.log('disconnection'+socket.id);
        if(Sockets.length>=2){
            if(Sockets[0].id==socket.id){
                turn_changed=false;
                turn=0;
                started=false;
                both_ready=false;
                Sockets[1].emit('restart');
            }
            else if(Sockets[1].id==socket.id){
                turn_changed=false;
                turn=0;
                started=false;
                both_ready=false;
                Sockets[0].emit('restart');
            }
        }
        let temp=[];
        while(Sockets[Sockets.length-1].id>socket.id){
            temp.push(Sockets.pop());
        }
        Sockets.pop();
        for(let i=temp.length-1;i>=0;i--){
            Sockets.push(temp[i]);
        }
    });
});

setInterval(function(){
    if(turn_changed){
        turn^=1;
        Sockets[turn].emit('turn',vis);
        turn_changed=false;
    }
    if(Sockets.length>=2){
        if(!started){
            started=true;
            console.log('game_started'+Sockets[0].id+Sockets[1].id);
            Sockets[0].emit('game_started');
            Sockets[1].emit('game_started');
        }
        if(Sockets[0].ready && Sockets[1].ready && !both_ready){
            both_ready=true;
            Sockets[0].emit('both_ready',[Sockets[1].map,'mine']);
            Sockets[1].emit('both_ready',[Sockets[0].map,'opponents']);
        }
    }
}, 1000/50);