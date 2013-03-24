


var log = console.log;

var crypto = require("crypto");

var data = require("./data");

var Data = data.Data;



function randomData(n) { return Data(crypto.randomBytes(n)); } // Make n bytes of random data

exports.randomData = randomData;




