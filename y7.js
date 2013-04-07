

var log = console.log;


//what would it look like to make your own collections
//all you need is a linked list with an interator that you can move forward and back on
//and a set taht refuses duplcates
//and a set or list that stays sorted as you add items
//and allows removing quickly
//you could probably do this all at once with a single List that has options like staySorted and allowDuplicates
//and then classes which have to have methods like a.same(b) and a.sort(b)
//also, you need a sort() method to resort in case an item has changed, and an isSorted() method to determine if sort() is necessary



//Set, SortedSet, List, SortedList

//List
//has length, first, and last
//add() and remove(item)

//Item
//has back() and next()
//and a link back to the list it's in, check this
//and isFirst() and isLast()
//and here() or value() or something to get to what's held here

//holds
//has same() and sort()

//yeah, this looks pretty good, start writing it and some tests
//put it in list.js

//also from this you'll do TwoBoots, probably




//write a 10k challenge
//where you add 10k items to an array
//and then remove the middle one
//and compare how fast that runs in java and javascript

//another thing you are going to want to be able to do in the future is make a map where the keys are your own type
//for instance, the keys might be IpPort, or the object that identifies a peer





//calls these methods on your objects
//function same(o){}//returns true or false
//function sort(o){}//returns -1, 0, or 1



function List() {
	var c = BaseList(false, false); // Allow duplicates, add on end
	c.isList = function(){};
	return c;
}

function SortedList() {
	var c = BaseList(false, true); // Allow duplicates, add in sorted order
	c.isSortedList = function(){};
	return c;
}

function Set() {
	var c = BaseList(true, false); // Block duplicates, add on end
	c.isSet = function(){};
	return c;
}

function SortedSet() {
	var c = BaseList(true, true); // Block duplicates, add in sorted order
	c.isSortedSet = function(){};
	return c;
}





function BaseList(blockDuplicates, sortedOrder) {

	var _blockDuplicates = blockDuplicates;
	var _sortedOrder = sortedOrder;

	function size() {}
	function get(i) {}
	function has(o) {}
	function add(o) {}//returns true if we added it, false if this is a set and we already had it
	function remove(i) {}
	function clear() {}
	function sort() {}//sort now in case one of the objects we added changed

	return {
		size:size, get:get,
		has:has, add:add, remove:remove,
		clear:clear,
		sort:sort
	};
}






// ----
var start = new Date();
// ----

var size = 10000;//1k is 12ms, so i guess that's fast enough

var a = [];
for (var i = 0; i < size; i++) {
	a.push(i);
}

while (a.length) {
	var r = Math.floor(a.length / 2);
	a.splice(r, 1);
}

// ----
var end = new Date();
console.log("Operation took " + (end.getTime() - start.getTime()) + "ms");
// ----




