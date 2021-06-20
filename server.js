const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');

const port = process.env.PORT || 80;
const app = express();
var cors = require('cors');
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(cors());

    
const server = http.createServer(app, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

var clients = []

var data = {
    personTurn: false,
    time: 20,
    board: [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ],
    results: [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ]
}
JSON.safeStringify = (obj, indent = 2) => {
    let cache = [];
    const retVal = JSON.stringify(
      obj,
      (key, value) =>
        typeof value === "object" && value !== null
          ? cache.includes(value)
            ? undefined // Duplicate reference found, discard key
            : cache.push(value) && value // Store value in our collection
          : value,
      indent
    );
    cache = null;
    return retVal;
  };

const io = socketIo(server); // < Interesting!
io.on("connection", (socket) => {
    socket.send(JSON.stringify(data))
    clients.push(socket)
    socket.on("message", (m)=> {
        var d = JSON.parse(m)
        data.board[d.vote]++
        if(d.adminVote) {
            data.results[d.adminVote] = 2
            data.personTurn = false
            data.time = 10
        }
    })
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});


server.listen(port, () => console.log(`Listening on port ${port}`));
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

setInterval(()=>{
    if(data.time > 0) data.time-=1
    if(data.time == 0 && !data.personTurn) { 
        data.personTurn = true
        data.results[indexOfMax(data.board)]=1
        data.board = [0,0,0,0,0,0,0,0,0]
    } 
    clients.forEach((socket)=>{
        socket.send(JSON.stringify(data))
    })
}, 1000)