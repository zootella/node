
var log = console.log;








function upper(s) {
	return s.toUpperCase();
}

String.prototype.myUpper = function() {
	return upper(this);
}

log(upper("hi"));
log("hi".upper());


var s = first("hi");
second(s);

second(first("hi"));

"hi".first().second();








