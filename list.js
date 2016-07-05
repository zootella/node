
require("./load").load("list", function() { return this; });




//   ____             _           _   _     _     _     ____       _   
//  / ___|  ___  _ __| |_ ___  __| | | |   (_)___| |_  / ___|  ___| |_ 
//  \___ \ / _ \| '__| __/ _ \/ _` | | |   | / __| __| \___ \ / _ \ __|
//   ___) | (_) | |  | ||  __/ (_| | | |___| \__ \ |_   ___) |  __/ |_ 
//  |____/ \___/|_|   \__\___|\__,_| |_____|_|___/\__| |____/ \___|\__|
//                                                                     

function _list(compare) {

	var list = {};
	list.c = compare;   // The given function we'll use to compare objects
	list.a = [];        // Our internal array we use to hold objects
	list.n = 0;         // How many objects are in our array
	list.sorted = true; // True when this list is sorted, assuming items don't change

	list.check = function check(i) { if (i < 0 || i >= list.n) toss("bounds"); } // Make sure the given index fits in our array
	list.length = function length() { return list.n; } // How many items we carry
	list.get = function get(i) { list.check(i); return list.a[i]; } // Get the item at the given index
	list.has = function has(o) { return list.find(o) != -1; } // True if o is the same as something we have

	// Insert new item o at index i, moving everything there and beyond down
	list.insert = function insert(o, i) {
		if (i < 0 || i > list.n) toss("bounds"); // Inserting at n is ok
		list.a.splice(i, 0, o); // Remove 0 items, add o at i
		list.n++;
		list.sorted = false; // The list might not be sorted anymore
	}
	// Remove the item at index i from this list and return it
	list.remove = function remove(i) {
		list.check(i);
		var o = list.a[i];
		list.a.splice(i, 1); // At index i, remove 1 item and shift those after it towards the start
		list.n--; // It's ok for p to go out of bounds because we call margin before using it
		return o;
	}
	// Remove all the items we have, leaving this list empty
	list.clear = function clear() {
		list.a = [];
		list.n = 0;
		list.sorted = true; // Empty list is sorted
	}

	// Compare o to the item in list at index a
	// Return 0 if same, -1 if o is lighter than a, 1 if o is heavier
	list.compare = function compare(o, a) {
		var r = list.c(o, list.get(a));
		if (r == 0) return 0;
		else if (r < 0) return -1;
		else if (r > 0) return 1;
		else toss("type");
	}
	// Sort the items in our list
	list.sort = function sort() {
		list.a.sort(list.c);
		list.sorted = true;
	}
	// True if this list is sorted right now, assuming items didn't change
	list.isSorted = function isSorted() { return list.sorted; }

	// Describe this list as a line of text like "a,b,c,d,e"
	list.text = function text() {
		var s = "";
		for (var i = 0; i < list.n; i++) {
			s += say(list.get(i));
			if (i + 1 < list.n) s += ",";
		}
		return s;
	}

	return list;
}

// Find the index of an item that matches o in list, -1 if not found
function _findInUnsorted(list, o) {
	for (var i = list.n - 1; i >= 0; i--) // Backwards to find fast what was recently added
		if (list.c(o, list.a[i]) == 0) return i;
	return -1; // Not found
}

// Add o to the end of list
function _addToUnsortedList(list, o) {
	list.insert(o, list.n);
	return true; // Report yes, we added it
}

// If list doesn't already have o, add it to the end
function _addToUnsortedSet(list, o) {
	if (list.has(o)) return false; // Already got it
	list.insert(o, list.n);
	return true; // Yes, we added it
}

// Find the index of an item that matches o in list, -1 if not found
// List is sorted and may or may not have duplicates
function _findInSorted(list, o) {

	var a = 0;      // Distance to first item in clip
	var z = list.n; // Distance beyond last item in clip
	var r;          // Zero if same, negative if e1 lighter then e2, positive if e2 heavier

	while (true) {

		var n = z - a;                // Width of clip
		var y = z - 1;                // Distance to last item in clip
		var m = a + divideFast(n, 2); // Distance to middle item in clip

		if (n == 0) { // Empty

			return -1;

		} else if (n < 4) { // Too few items for middle to be useful

			r = list.compare(o, a);
			if (r == 0) return a; // Found
			if (r < 0) return -1; // Can't be before a
			a++;                  // Loop again to look after a

		} else { // Middle is useful

			r = list.compare(o, a);
			if (r == 0) return a; // Found
			if (r < 0) return -1; // Can't be before a

			r = list.compare(o, y);
			if (r == 0) return y; // Found
			if (r > 0) return -1; // Can't be after y

			r = list.compare(o, m);
			if (r == 0) return m; // Found
			if (r < 0) { a++;       z = m; } // Look next in lighter half
			else       { a = m + 1; z--;   } // Look next in heavier half
		}
	}
}

// Add o to list, which is sorted and allows duplicates, and return true
function _addToSortedList(list, o) {

	var a = 0;      // Distance to first item in clip
	var z = list.n; // Distance beyond last item in clip
	var r;          // Zero if same, negative if e1 lighter then e2, positive if e2 heavier

	while (true) {

		var n = z - a;                // Width of clip
		var y = z - 1;                // Distance to last item in clip
		var m = a + divideFast(n, 2); // Distance to middle item in clip

		if (n == 0) { // Empty

			list.insert(o, a); return true;

		} else if (n < 4) { // Too few items for middle to be useful

			r = list.compare(o, a);
			if (r <= 0) { list.insert(o, a); return true; } // Same or lighter
			a++; // Heavier, loop again to look after a

		} else { // Middle is useful

			r = list.compare(o, a);
			if (r <= 0) { list.insert(o, a); return true; } // Same or lighter

			r = list.compare(o, y);
			if (r >= 0) { list.insert(o, z); return true; } // Same or heavier

			r = list.compare(o, m);
			if (r == 0) { list.insert(o, m); return true; }
			if (r < 0) { a++;       z = m; } // Look next in lighter half
			else       { a = m + 1; z--;   } // Look next in heavier half
		}
	}
}

// Add o to list, which is sorted and blocks duplicates, return true if added, false if found
function _addToSortedSet(list, o) {

	var a = 0;      // Distance to first item in clip
	var z = list.n; // Distance beyond last item in clip
	var r;          // Zero if same, negative if e1 lighter then e2, positive if e2 heavier

	while (true) {

		var n = z - a;                // Width of clip
		var y = z - 1;                // Distance to last item in clip
		var m = a + divideFast(n, 2); // Distance to middle item in clip

		if (n == 0) { // Empty

			list.insert(o, a); return true;

		} else if (n < 4) { // Too few items for middle to be useful

			r = list.compare(o, a);
			if (r == 0) return false; // Block duplicate
			if (r < 0) { list.insert(o, a); return true; } // Lighter, insert at a
			a++; // Heavier, loop again to look after a

		} else { // Middle is useful

			r = list.compare(o, a);
			if (r == 0) return false;
			if (r < 0) { list.insert(o, a); return true; } // Lighter than a

			r = list.compare(o, y);
			if (r == 0) return false;
			if (r > 0) { list.insert(o, z); return true; } // Heavier than y

			r = list.compare(o, m);
			if (r == 0) return false;
			if (r < 0) { a++;       z = m; } // Look next in lighter half
			else       { a = m + 1; z--;   } // Look next in heavier half
		}
	}
}

// Compare to return 0 if r1 and r2 point to the same thing in memory
function _compareReferences(r1, r2) {
	if (r1 === r2) return 0;
	else return -1; // On two !== references, < and > both return false, so we can't sort them
}

// Count how many items in list match o, return 0+ how many are the same
function _countSameInList(list, o) {
	var count = 0;
	for (var i = list.n - 1; i >= 0; i--)
		if (list.c(o, list.a[i]) == 0) count++;
	return count;
}
function _countSameInSet(list, o) {
	return list.find(o) == -1 ? 0 : 1; // A set should only have 1 match, so use find, which may be faster
}

// Remove all the items in list that match o, return 0+ how many were the same and got removed
function _removeSameInList(list, o) {
	var count = 0;
	for (var i = list.n - 1; i >= 0; i--) // Loop backwards when removing
		if (list.c(o, list.a[i]) == 0) { list.remove(i); count++; }
	return count;
}
function _removeSameInSet(list, o) {
	var i = list.find(o);
	if (i == -1) {
		return 0;
	} else {
		list.remove(i);
		return 1;
	}
}

// Allows adding duplicates, no automatic sorting
function List(compare) {
	checkType(compare, "function");
	var list = _list(compare);
	list.find = function find(o) { return _findInUnsorted(list, o); }
	list.add = function add(o) { return _addToUnsortedList(list, o); }
	list.countSame = function countSame(o) { return _countSameInList(list, o); }
	list.removeSame = function removeSame(o) { return _removeSameInList(list, o); }
	list.type = "List";
	return list;
}

// Blocks adding duplicates, no automatic sorting
function Set(compare) {
	checkType(compare, "function");
	var list = _list(compare);
	list.find = function find(o) { return _findInUnsorted(list, o); }
	list.add = function add(o) { return _addToUnsortedSet(list, o); }
	list.countSame = function countSame(o) { return _countSameInSet(list, o); }
	list.removeSame = function removeSame(o) { return _removeSameInSet(list, o); }
	list.type = "Set";
	return list;
}

// Allows adding duplicates, keeps sorted
function SortedList(compare) {
	checkType(compare, "function");
	var list = _list(compare);
	list.find = function find(o) { return _findInSorted(list, o); }
	list.add = function add(o) { return _addToSortedList(list, o); }
	list.countSame = function countSame(o) { return _countSameInList(list, o); }
	list.removeSame = function removeSame(o) { return _removeSameInList(list, o); }
	list.type = "SortedList";
	return list;
}

// Blocks adding duplicates, keeps sorted
function SortedSet(compare) {
	checkType(compare, "function");
	var list = _list(compare);
	list.find = function find(o) { return _findInSorted(list, o); }
	list.add = function add(o) { return _addToSortedSet(list, o); }
	list.countSame = function countSame(o) { return _countSameInSet(list, o); }
	list.removeSame = function removeSame(o) { return _removeSameInSet(list, o); }
	list.type = "SortedSet";
	return list;
}

// A list of references, allows duplicates, you cannot sort by reference
function ReferenceList() {
	var list = _list(_compareReferences);
	list.find = function find(o) { return _findInUnsorted(list, o); }
	list.add = function add(o) { return _addToUnsortedList(list, o); }
	list.sort = function sort() { toss("type"); } // You can't weigh references, you can only tell if they are equal
	list.countSame = function countSame(o) { return _countSameInList(list, o); }
	list.removeSame = function removeSame(o) { return _removeSameInList(list, o); }
	list.type = "ReferenceList";
	return list;
}

// A set of references, blocks duplicates, you cannot sort by reference
function ReferenceSet() {
	var list = _list(_compareReferences);
	list.find = function find(o) { return _findInUnsorted(list, o); }
	list.add = function add(o) { return _addToUnsortedSet(list, o); }
	list.sort = function sort() { toss("type"); }
	list.countSame = function countSame(o) { return _countSameInSet(list, o); }
	list.removeSame = function removeSame(o) { return _removeSameInSet(list, o); }
	list.type = "ReferenceSet";
	return list;
}

exports._list = _list; // Exported for testing
exports.List = List;
exports.Set = Set;
exports.SortedList = SortedList;
exports.SortedSet = SortedSet;
exports.ReferenceList = ReferenceList;
exports.ReferenceSet = ReferenceSet;

//have it count how many compares it does

//TODO measure how slow the add and find take, put the unified meter object on that
//and then if meter wants to use these, have it use them unmetered

//TODO have outline use this instead of array and sort by itself
//but would still have to sort before output because outline items can change

//you probably don't have to add anything to the array prototype anymore because you can use list instead
//can you insert things in a certain position of the list

//grow this in the following ways
//make a hash/dictionary where the keys are whatever kind of object you want, like IpPort, for instance, and the values are whatever kind of object you want
//make twoboots that closes and clears by default
//make the list that holds a random sample of n items of all the items you've ever given it
//sort a list into a random order

//another thing you are going to want to be able to do in the future is make a map where the keys are your own type
//for instance, the keys might be IpPort, or the object that identifies a peer

//switch to using
//http://www.collectionsjs.com
//because these four are already there, along with a bunch more you might need
//just update tests to confirm use, and compare speed

//new in es6 is Map and Set

























