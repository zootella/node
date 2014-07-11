




var map = {

	fileb: ["filea", "data"],
	filec: []
}



function batch(file, get, set, produce_this) {
	/*
	var files = map[file];
	for (var i = 0; i < files.length; i++) {
		var source = require("./" + files[i]);
		for (s in source) {
			if (get(s)) console.log("overwriting " + s);
			set(s, source[s]);
		}
	}
	*/

	console.log(produce_this);

	var o = produce_this();

	var files = map[file];
	for (var i = 0; i < files.length; i++) {
		var source = require("./" + files[i]);
		for (s in source) {
			if (o[s]) console.log("overwriting " + s);
			o[s] = source[s];
		}
	}
}

exports.batch = batch;





