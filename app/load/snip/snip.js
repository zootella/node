








console.log("global is "      + typeof global);//object
console.log("global.fun1 is " + typeof global.fun1);//undefined

global.fun1 = function() {
	return "hi from fun1";
}

console.log("now, global.fun1 is " + typeof global.fun1);//function













