
var log = console.log;

function Car(setModel, setYear, setColor) {

	//members
	var _model = setModel;
	var _year  = setYear;
	var _color = setColor;

	//getters
	function model() { return _model; }
	function year()  { return _year;  }
	function color() { return _color; }

	//mutator
	function paint(newColor) {
		_color = newColor;
	}

	//story
	function storyBroken() {
		return composeStory(this);
	}
	function storyWorkaround() {
		return composeStory(Car(_model, _year, _color));//copy the object to pass it out
	}

	//public methods
	return {
		model:model, year:year, color:color,
		paint:paint,
		storyBroken:storyBroken, storyWorkaround:storyWorkaround
	};
}

function composeStory(car) {
	return "Once upon a time in " + car.year() + ", there was a bright shiny " + car.color() + " " + car.model() + ".";
}

exports.testDemo = function(test) {

	test.ok(true);

	var car = Car("Cavalier", 1992, "white");
	var story = "Once upon a time in 1992, there was a bright shiny white Cavalier.";

	test.ok(story == composeStory(car));
	test.ok(story == car.storyWorkaround());
	test.ok(story == car.storyBroken());//well, actually, it works. and you didn't even use new when you made the car!

	test.done();
}







