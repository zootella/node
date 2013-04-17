



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



//write them all as functions
//in a separate section, add them to String prototype

//add parse, it's not here for some reason

//write sortData(a, b) as a separate function

//watch rock dots go between upper and lower case
//watch french accents get alphebetized correctly

//write make safe for windows file name
//write url encode and decode parts

//look in cpp text code, this is the most recent and complete job you did with parse() and uri encoding of international characters 



function get(s, i) {
	return s.charAt(i);
}




