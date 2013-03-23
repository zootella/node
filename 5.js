






function sampleFunction(more) {
	log("sample function says hi");
	if (more) {
		log("and will now call sample object:")
		var s = SampleObject(false);
		s.print();
	}
}




function SampleObject() {
	function print(more) {
		log("sample object says hi");
		if (more) {
			log("and will now call sample function:")
			sampleFunction(false);
		}
	}

	return { print:print }
}



exports.sampleFunction = sampleFunction;
exports.SampleObject = SampleObject;


/*
exports.includeAll = function includeAll(o) {
	//a more advanced version of this should throw if it would overwrite something
	//also, write it so that you can call something like this after each group of functions:
	//export(Object, functionA, functionB);
	//then it calls down here, and adds those to the hash
	o.sampleFunction = sampleFunction;
	o.SampleObject = SampleObject;
	log('done adding stuff');
}
*/


/*
var o = {};
require('./base').includeAll(o);//this works when it's o, but not when it's this
o.sampleFunction();
*/



