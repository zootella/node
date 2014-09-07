
require("./load").load("base", function() { return this; });


//try these parts of q
//just a few useful functions from each
//-collections, (done)
//-basic q, turning callbacks into promises
//-q io on the filesystem


var q = require("q");
var qfs = require("q-io/fs");





function useQ() {

	log(q);


}


function copyFile() {

	var promise = qfs.copy("E:\\test\\source.txt", "E:\\test\\target.txt");
}

exports.useQ = useQ;
exports.copyFile = copyFile;








