var game = [[" "," "," "],[" "," "," "],[" "," "," "]];

var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  var display="";
  for (const row of game) { 
    for (const column of row) {
      display += column + "|"
      }
    display += "------";
  }
  res.write(display);
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
