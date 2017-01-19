







//here's a demo why you can't use module
//only global let's you use it like you declared it like a var
//so even if module is protected, there's no unpacking

function custom1source() {
	return "hello from custom 1";
}

function custom2source() {
	return "hello from custom 2";
}

function app() {

	console.log("global works:");
	console.log(typeof global);//object
	console.log(typeof global["custom1"]);//undefined
	global["custom1"] = custom1source;
	console.log(typeof global["custom1"]);//function
	console.log(global.custom1());//works
	console.log(typeof custom1);//function
	console.log(custom1());//works

	console.log();
	console.log("module doesn't:");
	console.log(typeof module);//object
	console.log(typeof module["custom2"]);//undefined
	module["custom2"] = custom2source;
	console.log(typeof module["custom2"]);//function
	console.log(module.custom2());//works
	console.log(typeof custom2);//undefined
	console.log(custom2());//does not work, so this is why you can't use module, even if it is protected
}
app();










