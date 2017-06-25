var http=require("http");
var app = require('./api.js');

var port = 8092;

http.createServer(app).listen(process.env.PORT||port);

console.log("Listening on port "+ port);
