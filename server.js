// Imports
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
var cors = require('cors');
const { outcome, highestTile } = require('./lib/game');

const port = process.env.PORT || 80;
const app = express();
app.use(cors());

var entries = {

}

const server = http.createServer(app);

// Data
const emptyBoard = () => [
    {votes: 0, state: ''}, {votes: 0, state: ''}, {votes: 0, state: ''},
    {votes: 0, state: ''}, {votes: 0, state: ''}, {votes: 0, state: ''},
    {votes: 0, state: ''}, {votes: 0, state: ''}, {votes: 0, state: ''}
]
let board = emptyBoard()
let time = 0
let dirty = false
let gameActive = false
let collectiveTurn = true
let end = false;
let ending

// Socket
let clients = []

// Sockets that have voted in the current collective turn. Reset each round so
// a player gets one counted vote per round no matter how many tiles they click.
let votedThisRound = new Set()

const broadcast = (msg) => clients.forEach(sock => sock.send(msg))

// The admin's own connection must not count toward the total, or 100% could
// never be reached. Clients declare themselves on connect.
const trackedCount = () => clients.filter(sock => !sock.isAdmin).length

const sendStats = () => broadcast({
    type: "stats",
    tracked: trackedCount(),
    voted: votedThisRound.size,
    entries: Object.keys(entries).length
})

const io = socketIo(server); // < Interesting!
io.on("connection", (socket) => {
    console.log("Client connected")
    socket.isAdmin = false
    clients.push(socket)
    socket.send({type: "status", gameActive: gameActive})
    broadcast({type: "turn", collectiveTurn: collectiveTurn})
    if(end) {broadcast({type: "ending", ending: ending})}
    dirty = true

    broadcast({type: "entries", entries: entries})
    sendStats()

    socket.on("message", (m)=> {
        var d = JSON.parse(m)
        if(d.type == "identify") {
            socket.isAdmin = !!d.admin
            sendStats()
        }
        if(d.type == "vote") {
            if(board[d.tile].state == "" && collectiveTurn) {
                board[d.tile].votes++
                dirty = true
                if(!socket.isAdmin) {
                    votedThisRound.add(socket.id)
                    sendStats()
                    // Everyone has had their say — no reason to keep counting down.
                    if(gameActive && trackedCount() > 0 && votedThisRound.size >= trackedCount()) {
                        resolveCollectiveTurn()
                    }
                }
            }
        }
        if(d.type == "start") {
            gameActive = true;
            time = 10;
            votedThisRound = new Set()
            broadcast({type: "status", gameActive: gameActive})
            sendStats()
        }
        if(d.type == "ending") {
            declareEnding(d.ending)
        }
        if(d.type == "admin_vote") {
            if(board[d.tile].state == "" && !collectiveTurn) {
                board[d.tile].state = "o"
                dirty = true
                collectiveTurn = true;
                time = 10;
                votedThisRound = new Set()
                broadcast({type: "turn", collectiveTurn: collectiveTurn})
                sendStats()
                checkOutcome()
            }
        }
        if(d.type == "entry") {
            console.log(JSON.stringify(d))
            entries[d.ip] = d
            broadcast({type: "entries", entries: entries})
            sendStats()
        }
        if(d.type == "restart") {
            board = emptyBoard()
            time = 0;
            dirty = true;
            gameActive = false;
            end = false;
            ending = "";
            collectiveTurn = true;
            votedThisRound = new Set()
            broadcast({type: "board", board: board})
            broadcast({type: "status", gameActive: gameActive})
            broadcast({type: "turn", collectiveTurn: collectiveTurn})
            broadcast({type: "ending", ending: ""})
            sendStats()
        }
        if(d.type == "reset_entries") {
            entries = {}
            broadcast({type: "entries", entries: entries})
            sendStats()
        }
    })
    socket.on("disconnect", () => {
        clients = clients.filter(item => item !== socket)
        votedThisRound.delete(socket.id)
        console.log("Client disconnected");
        sendStats()
    });
});

// Ends the game and tells everyone. Used by both automatic detection and the
// admin's manual override buttons.
const declareEnding = (code) => {
    end = true;
    ending = code
    board.forEach(t=>t.votes = 0)
    broadcast({type: "board", board: board})
    broadcast({type: "ending", ending: ending})
    broadcast({type: "entries", entries: entries})
}

// The server now decides the result itself rather than waiting for the admin
// to judge it. The manual buttons still work as an override.
const checkOutcome = () => {
    const result = outcome(board)
    if(result) {
        declareEnding(result)
        return true
    }
    return false
}

// Claim the winning tile for the crowd and hand the turn to the admin.
const resolveCollectiveTurn = () => {
    const tile = highestTile(board)
    if(tile) tile.state = "x"
    board.forEach((x)=>{x.votes = 0})
    broadcast({type: "board", board: board})

    votedThisRound = new Set()
    if(checkOutcome()) {
        sendStats()
        return
    }

    collectiveTurn = false;
    broadcast({type: "turn", collectiveTurn: collectiveTurn})
    sendStats()
}

var previousTime = 0
setInterval(() => {
    if(!end) {
        if(dirty) {
            dirty = false
            broadcast({type: "board", board: board})
        }
        if(time > 0 && gameActive) time --
        if(time != previousTime) broadcast({type: "time", time: time})
        previousTime = time
        if(time == 0 && collectiveTurn && gameActive) {
            resolveCollectiveTurn()
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
