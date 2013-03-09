var state;

exports.setMe = function(v) {
	state = v;
}

exports.getMe = function() {
	console.log(global);
	return state;
}

//this function isn't exported
var anotherFunction = function() {
	console.log("hello from inside another function");
}

exports.another = anotherFunction;