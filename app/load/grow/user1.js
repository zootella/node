
console.log("user1 start");

require("./load").library();




function demo() {




	console.log(a1());//call a1, which calls b1, which calls c1, forwards works
	console.log(c3());//call c3, which calls b3, which calls a3, backwards works equally well

	console.log(a2());


}
demo();








console.log("user1 end");
