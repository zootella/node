
var requireMeasure = require("./measure");
var log = requireMeasure.log;

var requireText = require("./text");
var toss = requireText.toss;
var sortText = requireText.sortText;

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
var sortData = requireData.sortData;

var requireCollect = require("./collect");









//rename sortText and sortData to compareText and compareData


var List = requireCollect.List;
var Set = requireCollect.Set;
var SortedList = requireCollect.SortedList;
var SortedSet = requireCollect.SortedSet;

exports.testList = function(test) {

	var list = List(sortText);
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
















