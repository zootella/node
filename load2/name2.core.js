console.log("name2 core\\");
contain(function(expose) {


function core3() {
	return "c3";
}
function core4() {
	return "c4";
}
expose.core({core3, core4});





});
console.log("name2 core/");