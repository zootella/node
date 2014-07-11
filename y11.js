var color1 = "red";

function set2() {
	this["color2"] = "orange";
}

function set3(destination) {
	destination["color3"] = "yellow";
}

function set4() {
	this["color4"] = "green";
}

function getThis() { return this; }
function set5(f) {
	var t = f();
	t["color5"] = "blue";
}

set2();
set3(this);
set4.call(this);
set5(getThis);

console.log(color1);//works
console.log(color2);//works
//console.log(color3);//doesn't work, color3 is undefined
//console.log(color4);//doesn't work, color4 is undefined
console.log(color5);//works


















