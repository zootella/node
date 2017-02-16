console.log("name2 core\\");
contain(function(expose) {


function core3() {
	return "c3";
}
function core4() {
	return "c4";
}
expose.core({core3, core4});


function customDone(nodeunitTest) {
	/*
	clear(); // Remove closed objects from the list
	if (list.length) { // We should have closed them all, but didn't
		log(_sayList());
		nodeunitTest.fail();
		exit(); // Stop here instead of running the remaining tests
	} else { // The test closed everything correctly
		nodeunitTest.done(); // Tell nodeunit the test finished successfully
	}
	*/

	nodeunitTest.done();
}
expose.core({customDone});





});
console.log("name2 core/");