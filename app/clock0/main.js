
require("../../load").load("data_test", function() { return this; });

//require up twice instead of here
//run these with $ node app/clock0/main.js demo clock0


//finishes and exits
if (demo("clock0")) { demoClock0(); }
function demoClock0() {
	log("clock0: ", sayDateAndTime(now().time));
}

//uses the keyboard
if (demo("clock0a")) { demoClock0a(); }
function demoClock0a() {
	var screen = pulseScreen(function() {
		stick("clock0a: " + sayDateAndTime(now().time));
	});
	keyboard("exit", function() {
		close(screen);
		closeKeyboard();
		closeCheck();
	});
}






