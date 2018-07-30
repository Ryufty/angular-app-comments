var express = require("express");
var app = express();
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.listen(HTTP_PORT, function() {
    console.log("Server Listening on Port: " + HTTP_PORT);
})

