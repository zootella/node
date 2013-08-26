








//make a mini pulse and check shutdown right here


















//make a stopwatch with node charm



var charm = require("./node_modules/charm")();//closing parenthesis to run the function and save the result

charm.pipe(process.stdout);
charm.on("^C", process.exit);

charm.write("Progress: 0%");

var i = 0;
var interval = setInterval(function() {
	charm.left(i.toString().length + 1);
	i++;
	charm.write(i + "%");
	if (i == 100) {
		charm.end("\nDone!\n");
		clearInterval(interval);
	}
}, 50);







