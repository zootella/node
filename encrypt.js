


var log = console.log;

var crypto = require("crypto");

var data = require("./data");

var Data = data.Data;
var Size = data.Size;



function uniqueData() { return randomData(Size.value); } // 20 bytes of random data should be globally unique
function randomData(n) { return Data(crypto.randomBytes(n)); } // Make n bytes of random data

exports.uniqueData = uniqueData;
exports.randomData = randomData;




//write hash, use it to have data.hash()


