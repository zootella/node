console.log("name1 core\\");
contain(function(expose) {


function core1() {
	return "c1";
}
function core2() {
	return "c2";
}
expose.core({core1, core2});

function log(s) {
	console.log(s);
}
expose.core({log});





function myArrayLength(a, n1, n2) {
	return a.length + n1 + n2;
}

function myStringLength(s, n1, n2) {
	return s.length + n1 + n2;
}

expose.enhanceArray({myLength:myArrayLength});
expose.enhanceString({myLength:myStringLength});
expose.enhance("add", Array.prototype.push, Array.prototype);


expose.main("snip", function() {
	console.log("hi from snip, this is so easy");
	var a = [];
	a.add(1);
	a.add(2);
	a.add(3);
	console.log(a.length);

});



});
console.log("name1 core/");