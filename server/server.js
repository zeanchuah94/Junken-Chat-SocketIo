const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const RpsGame = require("./rps-game");

const app = express();
const clientPath = `${__dirname}/../client`;

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

io.on("connection",(socket)=>{
    if(waitingPlayer){
        // ゲーム開始
        new RpsGame(waitingPlayer,socket);
        waitingPlayer = null;
    } else {
        waitingPlayer = socket;
        waitingPlayer.emit("message","参加プレイヤー待機中...");
    }


    socket.on("message",(text)=>{
        //↑waitingplayer内のsocket.emitは個人へ対して
        //io.emitは部屋に入った全員に対して行う
        io.emit('message',text);
    })
})

server.on("error",(err)=>{
    console.error("Error:",err);
})

server.listen(8080,()=>{
    console.log("Localhost:8080 started");
})
