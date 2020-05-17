const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var path = require('path');

const port = 10000;
var env = {
    root : __dirname,
    uiAppLocalFolder : path.join(__dirname, '..')
}

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies   
  extended: true
})); 

app.get(/(.+)$/i, (req, res) => {
    try {
        delete require.cache[__dirname + '/app.js'];
        var APP = require(__dirname + '/app.js');
        var app = new APP(env, req, res);
        app.get();
    } catch (err) {
        res.send(err.toString());
    }

});

app.post(/(.+)$/i, (req, res) => {
    try {
        delete require.cache[__dirname + '/app.js'];
        var APP = require(__dirname + '/app.js');
        var app = new APP(env, req, res);
        app.post();
    } catch (err) {
        res.send(err.toString());
    }

});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));