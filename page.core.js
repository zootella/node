//console.log("page core\\");
contain(function(expose) {

// Use jQuery and Vue by their common names in the code here
var $ = required.jquery;
var Vue = required.vue;

// Add the given CSS to the top of the HTML page Electron is showing
function appendHead(s) {
	$(s).appendTo("head"); // Have jQuery add it to the end of what's inside <head>
}

// Register a new global Vue component from the given tag name like <someTag>, template text, and a make method that creates a new model object of data and methods
function tag(name, t) {

	// Parse tag name like "<someTag>" into name like "someTag"
	t.name = name.parse("<", ">").middle;
	if (!is(t.name)) toss("code");

	// Register it as a global Vue component
	Vue.component(t.name, { props: t.properties, template: t.template });

	// If this is the root <pageTag>, add another step to its make() method to put it on the page
	if (name == "<pageTag>") {
		var make = t.make; // Point make at the pageTag.make() method
		t.make = function() { // Replace it with this make() method instead
			var m = make.apply(this, arguments); // Make the component and get its model m

			// All index.html has is <div id="page"></div>, create the root Vue instance there, and save it in m
			m.rootVueInstance = new Vue({
				el: '#page',
				template: `<div id="page"><pageTag :key="m.id" :m="m"/></div>`,
				data: { m: m }
			});
			return m; // Return the model object we just made
		}
	}
	return t; // Return the tag we made, use it like var m = t.make() to make a new instance of the tag and get it's model object
}

// Make a unique identifier for a new element on the page, from "idn1" through "idn9000000000000000" and then "idnn1", quick and infinite
var idn_i, idn_s;
function idn() {
	if (!idn_s) idn_s = "id"; // Starting prefix
	if (!idn_i || idn_i > 9000000000000000) { idn_s += "n"; idn_i = 1; } // It's over nine thousand! actually quadrillion
	return idn_s + idn_i++; // Increment number for next time
}

expose.core({appendHead, tag, idn});





















//TODO change all these quick bad names to good names

var slowAlarm = 25;//freak out if a frame arrives more than 25ms after the previous one, taking 1.5x what it should
var slowDelay = 800;//when in slow mode, skip frames to only update every .8 seconds later
var arrivalsSize = 60;//see 60 quick frames before going back to fast mode
var arrivals = [];
var whenLastUpdated = 0;//tick when the last frame arrived in which we did an update
var arrivedToLog = 0;

//TODO replace with shut() which 1 must be shut, 2 won't set when shut, 3 won't call when shut
if (runByElectronRenderer()) window.requestAnimationFrame(watch);
function watch() {
	var now = tick();

	arrivals.push(now);//record that this frame arrived now

	if (true) {//true to see the time delays every 60 frames, around 1s if frames aren't delayed
		arrivedToLog++;
		if (arrivedToLog == 60) {
			arrivedToLog = 0;
			var s = "";
			for (var i = 0; i < arrivals.length - 1; i++) {
				var w = arrivals[i+1] - arrivals[i];
				s += (arrivals[i] + slowAlarm < arrivals[i+1]) ? w+"<----slow! " : w+" ";
			}
			console.log(s);
		}
	}

	if (arrivalsSize < arrivals.length) arrivals.splice(0, 1);//only keep the most recent 60
	//TODO duh, make the array circular to grow it once and reuse it after that, duh duh duh

	function allFast() {//loop for every pair of frame arrival times
		for (var i = 0; i < arrivals.length - 1; i++) {//safe to compare the distance of arrivals[i] and arrivals[i + 1]
			if (arrivals[i] + slowAlarm < arrivals[i+1]) return false;
		}
		return true;//no pairs yet, or all pairs are fast
	}

	//never updated before, or no pairs of frames yet, or last 1-59 pairs are all fast, or updated more than 800ms ago
	if (!whenLastUpdated || allFast() || whenLastUpdated + slowDelay < now) {
		whenLastUpdated = now;
		updateAllTheScreens();
	}

	window.requestAnimationFrame(watch);
}

// vvvv

//there's a frame we should paint on! maybe it's every frame! maybe it's a frame after skipping 800ms of them! doesn't matter, update away!
function updateAllTheScreens() {
	if (list) {
		for (var i = 0; i < list.length; i++) {//make one pass down the list
			var f = list[i];
			if (f.vNext != f.vPage) f.force(f.vNext);//only update if necessary
		}
		list = null;//toss out the list, we build it up anew for every pass
	}
}

// ^^^^

var list;//the list for the next single animation frame pass
function flicker(s) {//takes starting default value
	if (typeof s != "string") toss("code");

	var f = {};//make the new flicker object to fill and return
	f.vNext = s;//upcoming value to set now or in the next frame
	f.vPage = s;//our record of what we set and what is on screen
	f.v     = s;//what vue will watch, change v and vue changes the dom

	f.force = function(s) {//first, last, or important change, do it right now
		if (typeof s != "string") toss("code");
		if (s != f.vPage) {//reading v2 is a little faster than reading v, actually
			f.vNext = s;//this replaces a previously set upcoming value
			f.vPage = s;//keep a record of what we've got on the screen
			f.v     = s;//for maximum performance, we never read v, and only set it here
		}
	}

	f.frame = function(s) {//another step along the progress bar, do it a little later on
		if (typeof s != "string") toss("code");
		if (s != f.vNext) {//different than previously upcoming or set value
			f.vNext = s;//make it upcoming
			if (f.vNext != f.vPage) {//different than onscreen value, and we're not yet in the list to change the screen
				list ? list.push(f) : list = [f];//add us to the list, or start a new list with us
			}
		}
	}

	return f;
}

expose.core({flicker});

/*
simple and drastic throttled and not throttled
unless you make a mistake with the ui, it's never going to need to be throttled
utorrent has the 1s drumbeat, make your throttled speed 800ms to feel faster than a stopwatch (write that into the comments)

the program is requesting every frame, even when it doesn't have anything to do
if it gets a frame more then 20ms after the last one, something is wrong, now it skips painting until the frame after 800ms comes up
it remembers what happened with all the frames in the last 1 to 2 seconds, using a simple two bucket system (you don't even need an array, just two vars)
if all the frames in the last 1 to 2 seconds have arrived faster than 20ms, then it allows painting on every frame

ok, could there be an oscillation where there are two quick frames followed by a slow one?
no, because if always slow, there will be a slow frame every 800ms, it will always show up within the 1 to 2 second buckets, and throttling will stay on

TODO get shut() in here, if this system is shut down, don't do anythign when the frame arrives, and don't set th enext frame, either
*/




/*
here's the next example you make that can show all this and try it out

[50] [More] [Less] [Demi] [Clear] [Simple (switch to composed)] [Frame (switch to force)]
*/









function circular() {
	/*
	imagine the ring is already inflated
	length 60
	index of first element 0, last element length-1
	oldest points at the "start" of the array, where you do the first pair, what you replace with the new value


	*/
	var capacity = 60;
	var oldest = 5;

	ring[oldest] = now;
	oldest++;
	if (oldest == capacity) oldest = 0;//around the horn

	//loop for each pair
	var a = oldest;   if (a == capacity) a = 0;
	var b = oldest+1; if (b == capacity) b = 0;
	while (true) {
		if (!fastEnough(ring[a], ring[b])) return false;//found a slow one


		a++; if (a == capacity) a = 0;
		b++; if (b == capacity) b = 0;
		if (b == oldest) return true;//all fast enough
	}

	//imagine the ring is already inflated, .length 60, indices 0 through length-1

}

/*
just log each loop to watch it inflate, and then circle around

and load letters in then, A B C, like that, and log out the pairs it compares


*/



















});
//console.log("page core/");