var http = require('http'),
    ejs = require('ejs'),
    fs = require('fs'),
    express = require('express'),
    app = express();


app.use("/_css", express.static(__dirname + '/_css'));
app.use("/_data", express.static(__dirname + '/_data'));
app.use("/_libs", express.static(__dirname + '/_libs'));
app.use("/_scripts", express.static(__dirname + '/_scripts'));
app.use("/characters", express.static(__dirname + '/_scripts/compiled/_data/characters/'));

app.get('/', function(req,res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('app/index.ejs', 'utf-8', function (err, content) {
        if (err) {
            throw err;
        }
        var renderedHtml = ejs.render(content);
        res.end(renderedHtml);
    });
});

http.createServer(app).listen(3002);

console.log("App running on 3002");