



function isBlank(s) {
	if (typeof s !== "string") throw "type";
	if (s.length === 0) return true;
	return false;
}


function hasText(s) {
	if (typeof s !== "string") throw "type";
	if (s.length === 0) return false;
	return true;
}

//write tests for these, confirm they throw on undefined and null
//or just write s.hasText() and s.isBlank(), and confirm those throw if s is undefined or null
//unlike previous code, don't treat s = null as a valid blank string




/*

if (!('trim' in String.prototype)) {
}


//read to find out when you should use in, and when hasOwnProperty
//maybe use in instead of hasOwnProperty in Bin, for instance

String.prototype.distance = function (arg) {
    alert(arg);
};

*/






