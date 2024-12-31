var cfg = require("../config.js");
var config = cfg.userServer();
var express = require('express');
var app = express();
function send(res,ret) {
    var str = JSON.stringify(ret);
    res.send(str);
}

var config = null;
exports.start = function(cfg){
    config = cfg;
    app.listen(config.CLIENT_PORT);
    console.log("myaccount server is listening on "+config.CLIENT_PORT);
}


app.all('*',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/aaa', function(req, res) {
    console.log("aaa进入");
    send(res,"aaaa");
});

app.get('/bbb', function(req, res) {
    console.log("bbb进入");
    res.send("欢迎你进入bbb!");
});