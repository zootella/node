
console.log("load start");












//load all these modules in this order
var map = [
	"a",
	"b",
	"c"
];

//maybe one of them, and it'll tell us which one, called in here, so then you want to load all the others, in the appropriate order
/*
actually no, you don't have an entry points in library files, instead it's the tests for each file, and the tests can have loaded the whole library
so you maybe don't even need require statements in the different modules, because every user calls load, load calls them all in order, and then everybody has access to everything
so this can be really stupid simple
and is still better than going crazy on global because if you double-load, it will stop you



app1 app2 test1 test2
	|
	v
load.js
	|
	v
library1 library2 library3 library4


*/


function load(fromName) {//not sure if you actually need from name

}
exports.load = load;





var a = require("./a");

console.log("before: " + typeof a1);


var key = Object.keys(a);
for (var i = 0; i < key.length; i++) {

	var name = key[i];
	var value = a[key[i]];

	console.log(name + ", " + typeof value);

	if (global[name]) {//already here
		//freak the fuck out

	} else {//not yet in use

		global[name] = value;//pin it to the global object

	}

//	console.log(i + ", " + key[i] + ", " + typeof a[key[i]] + ", " + typeof global[a[key[i]]]);

}


console.log("after: " + typeof a1);









//put all their exports in the global namespace
//check to make sure you're not overwriting anything


//how do you loop through the exports in something



//how do you check to see if something is already in global
//and then add it to global

//and then see that you can get to it everywhere










console.log("load end");
