var http = require('http'),
    ejs = require('ejs'),
    fs = require('fs'),
    express = require('express'),
    app = express();

app.use("/css", express.static('css'));
app.use("/img", express.static('img'));
app.use("/games", express.static('games'));
app.use("/scripts", express.static('scripts'));
app.use("/stock-icons", express.static('img/stock-icons'));
app.use("/sprites", express.static('img/sprites'));

app.get('/demo', function(req,res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('games/demo.html', 'utf-8', (err, content) => {
        if (err) {
            throw err;
        }
        res.end(content);
    });
});

http.createServer(app).listen(7777);

console.log("App running on 7777");