function begin() {
	console.log("request handler begin called");

	function sleep(milliseconds) {
		var startTime = Date.now();
		while (Date.now() < startTime + milliseconds);
	}

	// wait 10 seconds before returning hello begin
	sleep(10000);
	return "hello begin";
}

// return hello upload right away
function upload() {
	console.log("request handler upload called");
	return "hello upload";
}

exports.upload = upload;
exports.begin = begin;

//hello from the cloned repository