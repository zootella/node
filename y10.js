

//make something available to the file from within a function in the file
//make sure it doesn't affect what's available in files that require this one


var color1 = "red";
var color2 = "orange";
//and we want to set two more colors, using the function below

function copyObject(destination, source) {
	for (s in source) {
		if (destination[s]) console.log("about to overwrite " + s);
		destination[s] = source[s];
	}
}



function setColors() {

	var extraColors = {color3:"yellow", color4:"green"};

	copyObject(this, extraColors);
}
setColors();


//now let's see what worked
console.log("color1 is " + color1);
console.log("color2 is " + color2);
console.log("color3 is " + color3);
console.log("color4 is " + color4);


//ok great, now see if you can pass this outside this function, then you don't have to paste the automatic importer into each file
























