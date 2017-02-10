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




});
console.log("name1 core/");