// Imports
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
var cors = require('cors');

const port = process.env.PORT || 80;
const app = express();
app.use(cors());

var entries = {

}

const server = http.createServer(app, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Data
let board = [
    {votes: 0, state: ''}, {votes: 0, state: ''}, {votes: 0, state: ''},
    {votes: 0, state: ''}, {votes: 0, state: ''}, {votes: 0, state: ''},
    {votes: 0, state: ''}, {votes: 0, state: ''}, {votes: 0, state: ''}
]
let time = 0
let dirty = false
let gameActive = false
let collectiveTurn = true
let end = false;
let ending

// Socket
let clients = []

const io = socketIo(server); // < Interesting!
io.on("connection", (socket) => {
    console.log("Client connected")
    clients.push(socket)
    socket.send({type: "status", gameActive: gameActive})
    clients.forEach(sock=>sock.send({type: "turn", collectiveTurn: collectiveTurn}))
    if(end) {clients.forEach(sock=>sock.send({type: "ending", ending: ending}))}
    dirty = true


    clients.forEach(sock=>sock.send({type: "entries", entries: entries}))



    socket.on("message", (m)=> {
        var d = JSON.parse(m)
        if(d.type == "vote") {
            if(board[d.tile].state == "" && collectiveTurn) {
                board[d.tile].votes++
                dirty = true
            }
        }
        if(d.type == "start") {
            gameActive = true;
            time = 10;
            clients.forEach(sock=>sock.send({type: "status", gameActive: gameActive}))
        }
        if(d.type == "ending") {
            end = true;
            ending = d.ending
            board.forEach(t=>t.votes = 0)
            clients.forEach(sock=>sock.send({type: "board", board: board}))
            clients.forEach(sock=>sock.send({type: "ending", ending: ending}))
            clients.forEach(sock=>sock.send({type: "entries", entries: entries}))
        }
        if(d.type == "admin_vote") {
            if(board[d.tile].state == "" && !collectiveTurn) {
                board[d.tile].state = "o"
                dirty = true
                collectiveTurn = true;
                time = 10;
                clients.forEach(sock=>sock.send({type: "turn", collectiveTurn: collectiveTurn}))
            }
        }
        if(d.type == "entry") {
            console.log(JSON.stringify(d))
            entries[d.ip] = d
        }
        if(d.type == "restart") {
            board.forEach((t)=>{
                t.votes = 0;
                t.state = 0;
            })
            time = 0;
            dirty = true;
            gameActive = false;
            end = false;
            ending = "";
            collectiveTurn = true;
            clients.forEach(sock=>sock.send({type: "status", gameActive: gameActive}))
            clients.forEach(sock=>sock.send({type: "turn", collectiveTurn: collectiveTurn}))
            clients.forEach(sock=>sock.send({type: "ending", ending: ""}))

        }
        if(d.type == "reset_entries") {
            entries = {}
            clients.forEach(sock=>sock.send({type: "entries", entries: entries}))

        }
    })
    socket.on("disconnect", () => {
        clients = clients.filter(item => item !== socket)
        console.log("Client disconnected");
    });
});

const findHighestTile = () => {
    var highestVotes = -1
    var highestTile = board[0]
    board.forEach((tile)=>{
        if(tile.votes > highestVotes && tile.state == "") {
            highestVotes = tile.votes
            highestTile = tile
        } 
    })
    return highestTile
}

var previousTime = 0
setInterval(() => {
    if(!end) {
        if(dirty) {
            dirty = false
            clients.forEach(sock=>sock.send({type: "board", board: board}))
        }
        if(time > 0 && gameActive) time --
        if(time != previousTime) clients.forEach(sock=>sock.send({type: "time", time: time}))
        previousTime = time
        if(time == 0 && collectiveTurn && gameActive) {
            
            findHighestTile().state = "x"
            board.forEach((x)=>{x.votes = 0})
            clients.forEach(sock=>sock.send({type: "board", board: board}))

            collectiveTurn = false;
            clients.forEach(sock=>sock.send({type: "turn", collectiveTurn: collectiveTurn}))
        }
    }
}, 1000);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/build/bundle.js', function(req, res) {
  res.sendFile(path.join(__dirname, '/build/bundle.js'));
});

app.get('/build/bundle.css', function(req, res) {
  res.sendFile(path.join(__dirname, '/build/bundle.css'));
});

app.get('/global.css', function(req, res) {
  res.sendFile(path.join(__dirname, '/global.css'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));




Object.filter = function( obj, predicate) {
    let result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};
