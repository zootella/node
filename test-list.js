
var requireMeasure = require("./measure");
var log = requireMeasure.log;
var now = requireMeasure.now;
var sayTime = requireMeasure.sayTime;
var Duration = requireMeasure.Duration;
var items = requireMeasure.items;
var commas = requireMeasure.commas;

var requireText = require("./text");
var toss = requireText.toss;
var compareText = requireText.compareText;
var line = requireText.line;

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

var requireHide = require("./hide");
var unique = requireHide.unique;








//   ____             _           _   _     _     _     ____       _   
//  / ___|  ___  _ __| |_ ___  __| | | |   (_)___| |_  / ___|  ___| |_ 
//  \___ \ / _ \| '__| __/ _ \/ _` | | |   | / __| __| \___ \ / _ \ __|
//   ___) | (_) | |  | ||  __/ (_| | | |___| \__ \ |_   ___) |  __/ |_ 
//  |____/ \___/|_|   \__\___|\__,_| |_____|_|___/\__| |____/ \___|\__|
//                                                                     

var _list = requireList._list;
var List = requireList.List;
var Set = requireList.Set;
var SortedList = requireList.SortedList;
var SortedSet = requireList.SortedSet;

exports.testListSizeGetClear = function(test) {

	var list = List(compareText);
	test.ok(list.size() == 0);

	list.add("a");
	test.ok(list.text() == "a");
	test.ok(list.size() == 1);
	test.ok(list.get(0) == "a");

	list.add("b");
	test.ok(list.text() == "a,b");
	test.ok(list.size() == 2);
	test.ok(list.get(0) == "a");
	test.ok(list.get(1) == "b");

	list.clear();
	test.ok(list.size() == 0);

	list.add("g");
	list.add("f");
	list.add("e");
	test.ok(list.text() == "g,f,e");

	done(test);
}

exports.testListInsertRemove = function(test) {

	var list = _list(compareText);

	list.insert("a", 0);//end
	list.insert("b", 1);
	list.insert("c", 2);
	test.ok(list.text() == "a,b,c");
	list.clear();

	list.insert("a", 0);//start
	list.insert("b", 0);
	list.insert("c", 0);
	test.ok(list.text() == "c,b,a");

	list.insert("D", 1);//middle
	list.insert("E", 3);

	test.ok(list.text() == "c,D,b,E,a"); test.ok(list.remove(2) == "b");//middle
	test.ok(list.text() == "c,D,E,a");   test.ok(list.remove(0) == "c");//first
	test.ok(list.text() == "D,E,a");     test.ok(list.remove(2) == "a");//last
	test.ok(list.text() == "D,E");

	done(test);
}

exports.testListBounds = function(test) {

	var list = _list(compareText);

	function cantInsert(o, i) {
		try {
			list.insert(o, i);
			test.fail();
		} catch (e) { test.ok(e.name == "bounds"); }
	}
	function cantGet(i) {
		try {
			list.get(i);
			test.fail();
		} catch (e) { test.ok(e.name == "bounds"); }
	}
	function cantRemove(i) {
		try {
			list.remove(i);
			test.fail();
		} catch (e) { test.ok(e.name == "bounds"); }
	}

	list.clear();
	cantInsert("a", -1);
	cantInsert("a", 1);
	cantGet(-1);
	cantGet(0);
	cantGet(1);
	cantRemove(-1);
	cantRemove(0);
	cantRemove(1);

	list.insert("a", 0);
	cantInsert("b", -1);
	cantInsert("b", 2);
	cantGet(-1);
	cantGet(1);
	cantRemove(-1);
	cantRemove(1);
	test.ok(list.get(0) == "a");
	test.ok(list.remove(0) == "a");
	test.ok(list.size() == 0);

	list.insert("a", 0);
	list.insert("b", 1);
	list.insert("c", 2);
	test.ok(list.text() == "a,b,c");
	cantInsert("d", -1);
	cantInsert("d", 4);
	cantGet(-1);
	cantGet(3);
	cantRemove(-1);
	cantRemove(3);
	test.ok(list.get(0) == "a");
	test.ok(list.get(1) == "b");
	test.ok(list.get(2) == "c");

	done(test);
}

exports.testList = function(test) {

	var l = List(compareText);
	l.add("c");//uses _addToUnsortedList
	l.add("b");
	l.add("a");
	test.ok(l.text() == "c,b,a");
	test.ok(l.size() == 3);
	test.ok(l.add("b"));//accepts duplicate and returns true
	test.ok(l.text() == "c,b,a,b");
	test.ok(l.size() == 4);

	test.ok(l.find("a") == 2);//uses _findInUnsorted
	test.ok(l.find("b") == 3);//finds last instance
	test.ok(l.find("c") == 0);
	test.ok(l.find("d") == -1);//not found
	test.ok(l.has("a"));
	test.ok(!l.has("d"));

	l.sort();
	test.ok(l.text() == "a,b,b,c");

	done(test);
}

exports.testSet = function(test) {

	var l = Set(compareText);
	l.add("c");//uses _addToUnsortedSet
	l.add("b");
	l.add("a");
	test.ok(l.text() == "c,b,a");
	test.ok(l.size() == 3);
	test.ok(!l.add("b"));//blocks duplicate and returns false
	test.ok(l.text() == "c,b,a");
	test.ok(l.size() == 3);

	test.ok(l.find("a") == 2);//uses _findInUnsorted again
	test.ok(l.find("b") == 1);
	test.ok(l.find("c") == 0);
	test.ok(l.find("d") == -1);//not found
	test.ok(l.has("a"));
	test.ok(!l.has("d"));

	l.sort();
	test.ok(l.text() == "a,b,c");

	done(test);
}

exports.testSortedList = function(test) {

	var l = SortedList(compareText);
	l.clear(); l.add("a"); l.add("b"); l.add("c"); test.ok(l.text() == "a,b,c");//uses _addToSortedList
	l.clear(); l.add("a"); l.add("c"); l.add("b"); test.ok(l.text() == "a,b,c");
	l.clear(); l.add("b"); l.add("a"); l.add("c"); test.ok(l.text() == "a,b,c");
	l.clear(); l.add("b"); l.add("c"); l.add("a"); test.ok(l.text() == "a,b,c");
	l.clear(); l.add("c"); l.add("a"); l.add("b"); test.ok(l.text() == "a,b,c");
	l.clear(); l.add("c"); l.add("b"); l.add("a"); test.ok(l.text() == "a,b,c");

	test.ok(l.add("b"));//duplicates allowed
	test.ok(l.text() == "a,b,b,c");
	test.ok(l.add("a"));
	test.ok(l.add("c"));
	test.ok(l.text() == "a,a,b,b,c,c");
	test.ok(l.remove(5) == "c");
	test.ok(l.remove(3) == "b");
	test.ok(l.remove(1) == "a");
	test.ok(l.text() == "a,b,c");

	test.ok(l.find("a") == 0);//uses _findInSorted
	test.ok(l.find("b") == 1);
	test.ok(l.find("c") == 2);
	test.ok(l.find("d") == -1);//not found
	test.ok(l.has("a"));
	test.ok(!l.has("d"));

	done(test);
}

exports.testSortedSet = function(test) {

	var l = SortedSet(compareText);
	l.clear(); l.add("a"); l.add("b"); l.add("c"); test.ok(l.text() == "a,b,c");//uses _addToSortedSet
	l.clear(); l.add("a"); l.add("c"); l.add("b"); test.ok(l.text() == "a,b,c");
	l.clear(); l.add("b"); l.add("a"); l.add("c"); test.ok(l.text() == "a,b,c");
	l.clear(); l.add("b"); l.add("c"); l.add("a"); test.ok(l.text() == "a,b,c");
	l.clear(); l.add("c"); l.add("a"); l.add("b"); test.ok(l.text() == "a,b,c");
	l.clear(); l.add("c"); l.add("b"); l.add("a"); test.ok(l.text() == "a,b,c");

	test.ok(!l.add("a"));//duplicates blocked
	test.ok(!l.add("b"));
	test.ok(!l.add("c"));

	test.ok(l.find("a") == 0);//uses _findInSorted again
	test.ok(l.find("b") == 1);
	test.ok(l.find("c") == 2);
	test.ok(l.find("d") == -1);//not found
	test.ok(l.has("a"));
	test.ok(!l.has("d"));

	done(test);
}

//see how big you can make sorted lists three different ways before things get really slow
if (demo("sort")) { demoSort(); }
function demoSort() {

	var n, t, l, d;

	function print(l) {
		var view = 5;
		var s = "";
		for (var i = 0; i < view; i++)
			s += line(l.get(i).base16());
		s += line("...");
		for (var i = n - view; i < n; i++)
			s += line(l.get(i).base16());
		return s;
	}

	n = 100000;
	t = now();
	l = List(compareData);
	for (var i = 0; i < n; i++)
		l.add(unique());
	l.sort();
	d = Duration(t);
	log(line("List, add #, sort once: #".fill(commas(n), sayTime(d.time()))) + line() + print(l));//if you only need the list sorted at the end, this is absolutely the way to go

	n = 2000;
	t = now();
	l = List(compareData);
	for (var i = 0; i < n; i++) {
		l.add(unique());
		l.sort();
	}
	d = Duration(t);
	log(line("List, add and sort #: #".fill(commas(n), sayTime(d.time()))) + line() + print(l));//if you need the list sorted all the time, even small lists are too slow

	n = 10000;
	t = now();
	l = SortedList(compareData);
	for (var i = 0; i < n; i++)
		l.add(unique());
	d = Duration(t);
	log(line("SortedList, add #: #".fill(commas(n), sayTime(d.time()))) + line() + print(l));//much better than sorting after every add, but not as good as sorting once at the end
}

//see how large you can make a sorted list before adding new items is too slow
//playing around with timeLimit set to 2, 5, and 10, SortedList lets you make things 10 times as big before adding gets the same amount slow
if (demo("add")) { demoAdd(); }
function demoAdd() {

	var timeLimit = 5;//adding an item should take less than 5ms
	var itemLimit = 50;//there should be less than 50 slow adds
	var l, t, n;
	log("start");

	//use List and sort after every add
	l = List(compareData);
	n = 0;
	while (true) {
		t = now();
		l.add(unique());
		l.sort();
		if (t.expired(timeLimit)) n++;//count another slow add
		if (n > itemLimit) break;//too many slow adds, stop
	}
	log("# got too slow sorting a List after every add".fill(items(l.size(), "unique")));

	//use SortedList instead
	l = SortedList(compareData);
	n = 0;
	while (true) {
		t = now();
		l.add(unique());
		if (t.expired(timeLimit)) n++;
		if (n > itemLimit) break;
	}
	log("# got too slow using SortedList instead".fill(items(l.size(), "unique")));
}

















