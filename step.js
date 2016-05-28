
var Q = require("q");
require("./load").load("base", function() { return this; });











//   ____                 
//  | __ )  __ _ ___  ___ 
//  |  _ \ / _` / __|/ _ \
//  | |_) | (_| \__ \  __/
//  |____/ \__,_|___/\___|
//                        

/*
base materials
*/

var SimulateTime = {};
SimulateTime.unit = 300;//adjust to make the demos finish faster or slower
SimulateTime.out = 4*SimulateTime.unit;
SimulateTime.limit = 8*SimulateTime.unit;
SimulateTime.multiple = 12*SimulateTime.unit;

//when the platform gives us something we have to remember to close, we wrap it in an object that must close
function SimulateResource() {
	var o = mustClose();
	o.text = "resource";
	return o;
};

exports.SimulateTime = SimulateTime;
exports.SimulateResource = SimulateResource;











//   __  __      _   _               _   _ 
//  |  \/  | ___| |_| |__   ___   __| | / |
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` | | |
//  | |  | |  __/ |_| | | | (_) | (_| | | |
//  |_|  |_|\___|\__|_| |_|\___/ \__,_| |_|
//                                         

/*
method 1: node callback
request(parameters, callback) later calls callback(error, answer)
*/

//simulated platform function with callback that can behave in every possible way
function simulateMethod1(behavior, callback) {

	if        (behavior == "t")  {//throw: throws before calling the callback, shouldn't happen but you never know
		throw "simulate";

	} else if (behavior == "n")  {//never: takes forever, never calls the callback
		//just do nothing

	} else if (behavior == "dd") {//done direct: succeeds, calling the callback directly, shouldn't happen but you never know
		callback(null, SimulateResource());

	} else if (behavior == "di") {//done instant: succeeds right away in a new event
		wait(0*SimulateTime.unit, function() { callback(null, SimulateResource()); });

	} else if (behavior == "df") {//done fast: succeeds in 3 time units, before the time limit
		wait(3*SimulateTime.unit, function() { callback(null, SimulateResource()); });

	} else if (behavior == "ds") {//done slow: succeeds in 5 time units, after the time limit
		wait(5*SimulateTime.unit, function() { callback(null, SimulateResource()); });

	} else if (behavior == "fd") {//fail direct: fails, calling the callback directly, shouldn't happen but you never know
		callback("simulate", SimulateResource());

	} else if (behavior == "fi") {//fail instant: fails right away in a new event
		wait(0*SimulateTime.unit, function() { callback("simulate", SimulateResource()); });

	} else if (behavior == "ff") {//fail fast: fails in 3 time units, before the time limit
		wait(3*SimulateTime.unit, function() { callback("simulate", SimulateResource()); });

	} else if (behavior == "fs") {//fail slow: fails in 5 time units, after the time limit
		wait(5*SimulateTime.unit, function() { callback("simulate", SimulateResource()); });

	}
}

exports.simulateMethod1 = simulateMethod1;














//   __  __      _   _               _   ____  
//  |  \/  | ___| |_| |__   ___   __| | |___ \ 
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` |   __) |
//  | |  | |  __/ |_| | | | (_) | (_| |  / __/ 
//  |_|  |_|\___|\__|_| |_|\___/ \__,_| |_____|
//                                             

/*
method 2: q promise
callback wrapped into a q promise
*/

//our simulated callback function turned into a q promise
function simulateMethod2(behavior) {
	var d = Q.defer();
	simulateMethod1(behavior, function(error, answer) {
		if (error) d.reject(error);
		else d.resolve(answer);
	});
	return d.promise;	
}

exports.simulateMethod2 = simulateMethod2;














//   __  __      _   _               _   _____ 
//  |  \/  | ___| |_| |__   ___   __| | |___ / 
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` |   |_ \ 
//  | |  | |  __/ |_| | | | (_) | (_| |  ___) |
//  |_|  |_|\___|\__|_| |_|\___/ \__,_| |____/ 
//                                             

/*
method 3: customzied callback
simple node-style callback, customized with your task and response objects to add safety and features
*/

//when finished, we'll call next(result), giving it a result object that says what happened
//returns a task object you can call task.cancel() on if you don't care about this anymore
function simulateMethod3(behavior, next) {
	var task = Task(next);
	task.call(function() {
		simulateMethod1(behavior, task.callback);
	});
	return task;
}

function Task(next) {//monitor the completion of an asynchronous call
	var startTime = now();//t start time

	//remember to close this task, notice if things are taking too long
	var o = mustClose();//we have to remember to close it
	o.pulse = function() {//and the program will pulse it for us
		if (startTime.expired(SimulateTime.out)) o.fail(Mistake("timeout"));//notice it's been taking too long
	}

	//run the given code that contains the method that will call the callback
	o.call = function(f) {
		try {
			f();
		} catch (e) { o.fail(e); }//threw an exception right in the request, not in the callback
	}

	/*
	TODO call is a special javascript thing, so pick a different name for here
	*/

	//cancel this task if you don't care anymore
	o.cancel = function() { o.fail(Mistake("cancel")); }//cancel when we don't want it anymore

	//standard platform callback to receive an error or answer
	o.callback = function(error, answer) {//platform calls with an outcome
		if (o.isClosed()) {
			close(answer);//we cancelled this task or it timed out, then the platform finished, close something it gave us
		} else if (error) {
			close(answer);//the platform should not give us both an error and an answer, but try closing it just in case
			o.fail(error);
		} else {
			o.done(answer);
		}
	}

	//helper functions used by code above, probably won't use these directly
	o.fail = function(error) {//finish with error
		if (o.isClosed()) return;
		close(o);
		sendResult(Result(startTime, error, null));
	}
	o.done = function(answer) {//finish with success
		if (o.isClosed()) return;
		close(o);
		sendResult(Result(startTime, null, answer));
	}
	function sendResult(result) {
		if (next) {
			wait(0, function() {
				try {
					next(result);
				} catch (e) { mistakeStop(e); }
			});
		}
	}

	//call these to get the current status of this ongoing or completed request
	o.progress = function() {
		return "todo";//compose and return a map with details like how long it's been running, what fraction is done, and so on
	}
	o.text = function() {
		return "todo";//progress information in a single line of text
	}

	//return the task so the caller can get current status, and cancel it
	o.type = "Task";
	return o;
};

function Result(startTime, error, answer) {//a result tells how an asynchronous task ended
	var o = {};

	//look at these properties directly
	o.duration = Duration(startTime);
	o.error = error;//error
	o.answer = answer;//answer

	//or call result.get(), and be passed the answer or thrown the error
	o.get = function () {
		if (o.error) throw o.error;
		else return o.answer;
	}

	//see if this result is about a successful completion or an error
	o.isError = function () { return o.error ? true : false; }
	o.isDone = function () { return o.error ? false : true; }

	o.text = function() {
		if (o.error) return say("fail '#'".fill(o.error));
		else         return say("done '#'".fill(o.answer));
	}

	o.type = "Result";
	return freeze(o);
}

exports.simulateMethod3 = simulateMethod3;
exports.Task = Task;
exports.Result = Result;

















//   __  __      _   _               _   _  _   
//  |  \/  | ___| |_| |__   ___   __| | | || |  
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` | | || |_ 
//  | |  | |  __/ |_| | | | (_) | (_| | |__   _|
//  |_|  |_|\___|\__|_| |_|\___/ \__,_|    |_|  
//                                              

/*
method 4: customized promise
callbacks wrapped into q promises, customized to add safety and features
*/

function simulateMethod4(behavior) {
	var d = Q.defer();
	var task = simulateMethod3(behavior, function (result) {
		//maybe put the result in the promise here
		if (result.isError()) d.reject(result.error);
		else d.resolve(result.answer);
	});
	//maybe put the task in the promise here
	return d.promise;	
}

exports.simulateMethod4 = simulateMethod4;

//method2 simply wrapped method1, could method4 simply wrap method3?
//ok, that's nice, but how can you pass back the task and result objects, like put them both in the promise or something















//   __  __      _   _               _   ____  
//  |  \/  | ___| |_| |__   ___   __| | | ___| 
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` | |___ \ 
//  | |  | |  __/ |_| | | | (_) | (_| |  ___) |
//  |_|  |_|\___|\__|_| |_|\___/ \__,_| |____/ 
//                                             

/*
method 5: customized promise
refactored customizations underneath q promises, with extra objects added
*/

function platformCallWrapped(parameter1, parameter2) {
	simulateMethod5(platformCall, a);
}

//TODO wrap up the paremters above, then unwrap them below
//confirm you can get the function above to a single line, which is what you want to be able to wrap a node call
//and then you can melt together the next two, and just leave result separate

function simulateMethod5(platformCall, a) {//our wrapping of the platform call, returns a promise with features inside
	var defer = Q.defer();
	var task = Task5(defer);
	task.call(function() {
		platformCall(parameter1, task.callback);//the platform call, takes a callback to give (error, answer)
	});
	defer.promise._addTask = task;
	return defer.promise;
}

function Task5(defer, timeout) {//monitor the completion of an asynchronous call
	if (!timeout) timeout = SimulateTime.out;//default timeout
	var startTime = now();//start time

	//remember to close this task, notice if things are taking too long
	var o = mustClose();//we have to remember to close it
	o.pulse = function() {//and the program will pulse it for us
		if (startTime.expired(timeout)) o.fail(Mistake("timeout"));//notice it's been taking too long
	}

	//run the given code that contains the method that will call the callback
	o.call = function(f) { try { f(); } catch (e) { o.fail(e); } }//threw an exception right in the request, not in the callback

	//cancel this task if you don't care anymore
	o.cancel = function() { o.fail(Mistake("cancel")); }//cancel when we don't want it anymore

	//standard platform callback to receive an error or answer
	o.callback = function(error, answer) {//platform calls with an outcome
		if (o.isClosed()) {
			close(answer);//we cancelled this task or it timed out, then the platform finished, close something it gave us
		} else if (error) {
			close(answer);//the platform should not give us both an error and an answer, but try closing it just in case
			o.fail(error);
		} else {
			o.done(answer);
		}
	}

	//helper functions used by code above, probably won't use these directly
	o.fail = function(error) {//finish with error
		if (o.isClosed()) return;
		close(o);
		defer.reject(Result5(startTime, error, null));
	}
	o.done = function(answer) {//finish with success
		if (o.isClosed()) return;
		close(o);
		defer.resolve(Result5(startTime, null, answer));
	}

	//call these to get the current status of this ongoing or completed request
	o.progress = function() {
		return "todo";//compose and return a map with details like how long it's been running, what fraction is done, and so on
	}
	o.text = function() {
		return "todo";//progress information in a single line of text
	}

	//return the task so the caller can get current status, and cancel it
	o.type = "Task5";
	return o;
};

function Result5(startTime, error, answer) {
	var o = {};
	o.duration = Duration(startTime);
	o.error = error;//error
	o.answer = answer;//answer
	o.text = function() {
		if (o.error) return say("fail '#'".fill(o.error));
		else         return say("done '#'".fill(o.answer));
	}
	o.type = "Result5";
	return freeze(o);
}

exports.simulateMethod5 = simulateMethod5;
exports.Task5 = Task5;
exports.Result5 = Result5;




















