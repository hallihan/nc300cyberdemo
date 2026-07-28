// Imports
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
var cors = require('cors');
const { outcome, highestTile } = require('./lib/game');

const port = process.env.PORT || 80;
// Seconds the crowd gets to vote each round. Override to tune the demo pace.
const roundSeconds = Number(process.env.ROUND_SECONDS) || 10;
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

// Sockets still considered engaged. A player who sits a round out drops out of
// here and stops holding up the early close, until they vote again. New
// connections start active so they get one round's grace to join in.
let activePlayers = new Set()

const broadcast = (msg) => clients.forEach(sock => sock.send(msg))

const isPlayer = (sock) => !sock.isAdmin

// The admin's own connection must not count toward the total, or 100% could
// never be reached. Clients declare themselves on connect.
const activeCount = () =>
    clients.filter(sock => isPlayer(sock) && activePlayers.has(sock.id)).length

const markActive = (socket) => {
    activePlayers.add(socket.id)
}

// Everyone connected gets a clean slate at the start of a game.
const resetActivePlayers = () => {
    activePlayers = new Set(clients.filter(isPlayer).map(sock => sock.id))
}

const sendStats = () => broadcast({
    type: "stats",
    tracked: activeCount(),
    voted: votedThisRound.size,
    entries: Object.keys(entries).length
})

const io = socketIo(server); // < Interesting!
io.on("connection", (socket) => {
    console.log("Client connected")
    socket.isAdmin = false
    clients.push(socket)
    markActive(socket)
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
            if(socket.isAdmin) activePlayers.delete(socket.id)
            sendStats()
        }
        if(d.type == "vote") {
            if(board[d.tile].state == "" && collectiveTurn) {
                board[d.tile].votes++
                dirty = true
                if(!socket.isAdmin) {
                    votedThisRound.add(socket.id)
                    markActive(socket) // voting re-engages a player who sat out
                    sendStats()
                    // Everyone still engaged has had their say.
                    if(gameActive && activeCount() > 0 && votedThisRound.size >= activeCount()) {
                        resolveCollectiveTurn()
                    }
                }
            }
        }
        if(d.type == "start") {
            gameActive = true;
            time = roundSeconds;
            votedThisRound = new Set()
            resetActivePlayers()
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
                time = roundSeconds;
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
            resetActivePlayers()
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
        activePlayers.delete(socket.id)
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

    // Anyone who sat this round out stops counting toward the next one. They
    // rejoin the moment they vote again.
    clients.forEach(sock => {
        if(isPlayer(sock) && !votedThisRound.has(sock.id)) activePlayers.delete(sock.id)
    })
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
