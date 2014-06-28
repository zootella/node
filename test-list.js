
var requireMeasure = require("./measure");
var log = requireMeasure.log;

var requireText = require("./text");
var toss = requireText.toss;
var compareText = requireText.compareText;

var requireState = require("./state");
var demo = requireState.demo;
var mistakeLog = requireState.mistakeLog;
var mistakeStop = requireState.mistakeStop;
var closeCheck = requireState.closeCheck;
var done = requireState.done;
var close = requireState.close;
var isClosed = requireState.isClosed;
var isOpen = requireState.isOpen;
var makeState = requireState.makeState;
var listState = requireState.listState;

var requireData = require("./data");
var outline = requireData.outline;
var compareData = requireData.compareData;

var requireList = require("./list");









var List = requireList.List;
var Set = requireList.Set;
var SortedList = requireList.SortedList;
var SortedSet = requireList.SortedSet;

exports.testList = function(test) {

	var list = List(compareText);
	list.add("a");
	log(list.text());
	list.add("b");
	log(list.text());

	done(test);
}

exports.testSet = function(test) {

	done(test);
}

exports.testSortedList = function(test) {

	done(test);
}

exports.testSortedSet = function(test) {

	done(test);
}





if (demo("sort")) { demoSort(); }
function demoSort() {

	//add a lot of random hash values to a list, then sort it

	//add a lot of random hash values to a sorted list, see how much slower this is

}
















