
var q = require("q");

require("./load").load("base", function() { return this; });






//example of synchronous code
if (demo("snippet")) { snippet(); }
function snippet() {


var outputPromise = getInputPromise().then(function done(input) {}, function fail(reason) {});

//then() returns a promise, outputPromise
//a function can only return a value, or throw an exception

//three things can happen
//if your handler returns a value, outputPromise gets fulfilled
//if your handler throws an exception, outputPromise gets rejected
//if your handler returns a promise, outputPromise becomes that promise

var error = getInputPromise().then(function done(input) {});//omit the error handler, and then() returns the error
var value = getInputPromise().then(null, function (error) {});//omit the fulfillment handler, and then() returns the success value

var value = getInputPromise().fail(function (error) {});//use fail() when you just want to pass the error handler

//the fin function is like the finally clause
//the function fin takes gets called when the getInputPromise promise returns a value or throws an error
//this is where you can close files, database connections, stop servers, conclude tests
var output = getInputPromise().fin(function () {/*close everything*/});

//there are two ways to chain promises: inside handlers, and outside handlers
//these two examples are the same


return getName().then(function (name) {//get the name
	return getUser(name).then(function (user) {//use the name to get the user
		//now we've got the user
	})
});

return getName().then(function (name) {//get the name
	return getUser(name);//use the name to get the user
}).then(function (user) {
	//now we've got the user
});




function authenticate() {
	return getName().then(function (name) {//get the name
		return getUser(name);//use the name to get the user
	})
	// chained because we will not need the name in the next event
	.then(function (user) {
		return getPass()
		// nested because we need both user and password next
		.then(function (pass) {
			if (user.passwordHash !== hash(pass)) {
				throw new Error("Can't authenticate");
			}
		});
	});
}

//bookmark "Combination"
//https://github.com/kriskowal/q/tree/v1#combination







}





//the tutorial promised you'd learn
//how to write your own functions that return promises


//this is in the section "create a promise from scratch"






