
require("./load").library();







//   ____             _           _   _     _     _     ____       _   
//  / ___|  ___  _ __| |_ ___  __| | | |   (_)___| |_  / ___|  ___| |_ 
//  \___ \ / _ \| '__| __/ _ \/ _` | | |   | / __| __| \___ \ / _ \ __|
//   ___) | (_) | |  | ||  __/ (_| | | |___| \__ \ |_   ___) |  __/ |_ 
//  |____/ \___/|_|   \__\___|\__,_| |_____|_|___/\__| |____/ \___|\__|
//                                                                     

exports.testListSizeGetClear = function(test) {

	var list = List(compareText);
	test.ok(list.length() == 0);

	list.add("a");
	test.ok(list.text() == "a");
	test.ok(list.length() == 1);
	test.ok(list.get(0) == "a");

	list.add("b");
	test.ok(list.text() == "a,b");
	test.ok(list.length() == 2);
	test.ok(list.get(0) == "a");
	test.ok(list.get(1) == "b");

	list.clear();
	test.ok(list.length() == 0);

	list.add("g");
	list.add("f");
	list.add("e");
	test.ok(list.text() == "g,f,e");

	done(test);
}

exports.testListInsertRemove = function(test) {

	var list = _list(compareText); // Exported just for testing

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
	test.ok(list.length() == 0);

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
	test.ok(l.length() == 3);
	test.ok(l.add("b"));//accepts duplicate and returns true
	test.ok(l.text() == "c,b,a,b");
	test.ok(l.length() == 4);

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

exports.testUniqueList = function(test) {

	var l = UniqueList(compareText);
	l.add("c");//uses _addToUnsortedSet
	l.add("b");
	l.add("a");
	test.ok(l.text() == "c,b,a");
	test.ok(l.length() == 3);
	test.ok(!l.add("b"));//blocks duplicate and returns false
	test.ok(l.text() == "c,b,a");
	test.ok(l.length() == 3);

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

exports.testSortedUniqueList = function(test) {

	var l = SortedUniqueList(compareText);
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
	log("# got too slow sorting a List after every add".fill(items(l.length(), "unique")));

	//use SortedList instead
	l = SortedList(compareData);
	n = 0;
	while (true) {
		t = now();
		l.add(unique());
		if (t.expired(timeLimit)) n++;
		if (n > itemLimit) break;
	}
	log("# got too slow using SortedList instead".fill(items(l.length(), "unique")));
}












if (demo("snip")) { demoSnip(); }
function demoSnip() {

	log("hi");
}




exports.testSnip = function(test) {

	test.ok(true);

	/*
	ok, so now you jsut want to have a [] of {} or functions
	and add and remove them based on their object reference

	here's what you are trying to figure out
	-does List help you do this, or is it useless for this
	-what happens if you have duplicates of the same {} or function in the same []

	*/


	//first, let's try to do it in just javascript

	var o1 = { name:"1" };
	var o2 = { name:"2" };
	var o3 = { name:"3" };
	var o4 = { name:"4" };

	var a = [];
	test.ok(a.length == 0);
	a.add(o1);
	a.add(o2);
	a.add(o3);
	test.ok(a.length == 3);

	function find(a, o) {//returns index of o in a, -1 if not found
		for (var i = 0; i < a.length; i++) {
			if (a[i] === o) return i;
		}
		return -1;
	}

	test.ok(find(a, o1) == 0);
	test.ok(find(a, o2) == 1);
	test.ok(find(a, o3) == 2);
	test.ok(find(a, o4) == -1);

	//ok, so that works and is pretty simple
	//now, can you do it with List?

	var l = List(function() {});
	test.ok(l.length() == 0);
	l.add(o1);
	l.add(o2);
	l.add(o3);
	test.ok(l.length() == 3);

	/*
	ok, here's why this is different, and you should do this in Array, not List
	you can easily test equality with ===, but you can never sort

	a.countByReference(o)
	a.findByReference(o)
	a.removeByReference(o)



	*/




	done(test);
}





/*
be able to easily do this stuff in the load system with tests

it's easy to export some functions for real, and others for tests, and only the tests can see them

you don't have to name test functions anymore
they don't have to have unique names, copy and paste exactly the same thing and it'll run twice
instead, you tag them with the functions they test
and write a short description of what is getting tested, what the purpose is
*/













exports.testCompareValueReference = function(test) {
	var v, c, d, r;//value, copy, different, and reference

	v = 5;//value
	c = v;//copy the value
	test.ok(v === c);
	test.ok(!(v !== c));
	test.ok(!(v < c));//both false because copy is the same
	test.ok(!(v > c));
	d = 7;//different greater value
	test.ok(!(v === d));
	test.ok(v !== d);
	test.ok(v < d);//both work because d is greater
	test.ok(!(v > d));

	r = {};//reference
	c = r;//copy the reference
	test.ok(r === c);
	test.ok(!(r !== c));
	test.ok(!(r < c));//both false because copy is the same
	test.ok(!(r > c));
	d = 7;//different later reference
	test.ok(!(r === d));
	test.ok(r !== d);
	test.ok(!(r < d));//both are false because you can equate references, but you can't sort them
	test.ok(!(r > d));

	done(test);
}




































exports.testArrayCountByReference = function(test) {

	var o1 = {};//empty objects with different references
	var o2 = {};
	var o3 = {};
	var o4 = {};

	var a = [];
	a.add(o1);
	a.add(o2);
	a.add(o3);
	a.add(o2);//again

	test.ok(a.length == 4);

/*
	test.ok(a.countByReference(o1) == 1);
	test.ok(a.countByReference(o2) == 2);
	test.ok(a.countByReference(o3) == 1);
	test.ok(a.countByReference(o4) == 0);

	do that with ReferenceList instead
	*/












	done(test);
}


/*
length
get
has
find, value to index

add, false already had it, or true we added it
remove, index, returns item you removed
clear

sort
isSorted

countSame, returns how many match, 0+
removeSame, returns how many it removed, 0+

text
type
*/




//TODO next
//write tests for countSame and removeSame on List, Set, SortedList, SortedSet, ReferenceList, and ReferenceSet








	/*
	TODO rename
	list -> l
	.c -> _c, _a, _n, _sorted
	function check(i) -> function(i)
	*/









/*
if ("countByReference" in Array.prototype) toss("program");
Object.defineProperty(Array.prototype, "countByReference", { enumerable: false, value: function(o) {
	var n = 0;
	for (var i = 0; i < this.length; i++) {
		if (this[i] === o) n++;
	}
	return n;
}});

if ("findByReference" in Array.prototype) toss("program");
Object.defineProperty(Array.prototype, "findByReference", { enumerable: false, value: function(o) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === o) return i;
	}
	return -1;
}});

if ("removeByReference" in Array.prototype) toss("program");
Object.defineProperty(Array.prototype, "removeByReference", { enumerable: false, value: function(o) {
	//maybe loop backwards and remove all that match that reference
	//and return how many you removed, for testing mostly, 0 not found, 1 most common, 2+ also possible
}});
*/


//in text.js, where you're augmenting string and []
//obviously refactor that to use augment(p, name, f)
/*

more you could do here
a.addAt(index, element) inserts it at element
a.add and insert take a list of arguments, insert them all right there

a.addAllAt
a.addAll take arrays, and add all the elements from the array rigth there
but before you do that, read up on how es6 does fancy array stuff like this already

and get this note out of here

no, make ReferenceList and ReferenceSet instead
then you can have even more methods like has()
and put those in list.js




*/

































