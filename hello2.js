
console.log("hello 2");

process.stdin.resume();//standard in starts paused by default, resume it to be able to get data
process.stdin.on("data", function(d) {//we got some data
	console.log("hello 2 received data:");
	console.log(d+"");//turn it into a string before logging it to standard out
});

/*
try running
$ node hello2.js

logs out "hello 2", just as hello 1 did
instead of exiting, keeps running to listen for data
you have to Ctrl+C to force quit it

then type something, like "k"
"k" appears on the command line, like it's echoing it or something
"hello 2 received data" never appears, though it seems like it should

acts the same even if you comment out the .resume() line above
*/
