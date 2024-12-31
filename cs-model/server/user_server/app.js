var cfg = require(process.argv[2]);
var config = cfg.userServer();

var us = require("./user_server");
us.start(config);