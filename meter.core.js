console.log("meter core\\");
contain(function(expose) {
























function meterDemoHeavy(made) {
	if (!made) made = now();
	var m = {  };
	return Meter(m, made);
}
function meterDemoLight(made) {
	if (!made) made = now();
	var m = {  };
	return Meter(m, made);
}



function meterDemoUnitPerUnit(made) {
	if (!made) made = now();
	var m = {  };
	return Meter(m, made);
}
function meterDemoUnitPerTime(made) {
	if (!made) made = now();
	var m = {  };
	return Meter(m, made);
}
function meterDemoSizePerUnit(made) {
	if (!made) made = now();
	var m = {  };
	return Meter(m, made);
}
function meterDemoSizePerTime(made) {
	if (!made) made = now();
	var m = {  };
	return Meter(m, made);
}



// Demo meter features

function meterDemoShortcut(made) {
	if (!made) made = now();
	var m = { "count": CountMeter(made) };
	var meter = Meter(m, made, "number");
	meter.n = meter.m.count.records; // Shortcut to get the number of records
	return meter;
}
function meterDemoDual(made) {
	if (!made) made = now();
	var m = {
		"count": CountMeter(made),
		"speed": SpeedMeter(made, { width:2*Time.second, guard:100 })};
	return Meter(m, made, "number");
}
function meterDemoInterval() {
	//simplest possible meter that contains another for testing
	//also, how does text work on that? probably a mess
}

// Meters packaged individually for demos and tests

function meterDemoCount(made) {
	if (!made) made = now();
	var m = { "count": CountMeter(made) };
	return Meter(m, made, "number"); // No real units, keyboard keys or numbers from tests
}
function meterDemoSpeed(made) {
	if (!made) made = now();
	var m = { "speed": SpeedMeter(made, { width:2*Time.second, guard:100 }) };
	//have a bunch of speed meters of doubling column widths
	return Meter(m, made, "number");
}
function meterDemoEdge(made) {
	if (!made) made = now();
	var m = { "edge": EdgeMeter(made, { capacity:100, wrap:20 }) }; // Wrap is just for the text display
	return Meter(m, made, "number");
}
function meterDemoSample(made) {
	if (!made) made = now();
	var m = {
		"scale":  ColumnMeter(made, columnSame({ i:0, w:1, n:10 })), 
		"sample": SampleMeter(made, { capacity:500, keepSorted:false, wrap:50 })};
	return Meter(m, made, "number");
}

// Column meters

function meterDemoColumn1(made) { // Columns without starting margin column
	if (!made) made = now();
	var m = { "scale": ColumnMeter(made, columnSame({ i:0, w:2, n:3 })) };// No margin column at the start
	return Meter(m, made, "number");
}
function meterDemoColumn2(made) { // Columns with a margin column
	if (!made) made = now();
	var m = { "scale": ColumnMeter(made, columnSame({ i:3, w:1, n:4 })) }; // Index where columns start, width of each column, and number of columns
	return Meter(m, made, "number");
}
function meterDemoColumn3(made) { // Scale with low rightmost edge
	if (!made) made = now();
	var m = { "scale": ColumnMeter(made, columnScale({ rightmostEdge:8 })) }; // Be able to see 8 and 9 land in the higher column in a keyboard demo
	return Meter(m, made, "number");
}
function meterDemoColumn4(made) { // Scale with standard rightmost edge
	if (!made) made = now();
	var m = { "scale": ColumnMeter(made, columnScale({ rightmostEdge:4*Size.pb })) }; // Big but won't overflow
	return Meter(m, made, "number");
}

expose.core({meterDemoHeavy, meterDemoLight});
expose.core({meterDemoUnitPerUnit, meterDemoUnitPerTime, meterDemoSizePerUnit, meterDemoSizePerTime});
expose.core({meterDemoShortcut, meterDemoDual, meterDemoInterval});
expose.core({meterDemoCount, meterDemoSpeed, meterDemoEdge, meterDemoSample});
expose.core({meterDemoColumn1, meterDemoColumn2, meterDemoColumn3, meterDemoColumn4});





// The container for a bunch of custom meters, which passes new records to them all
function Meter(m, made, unit) { // Takes component meters m, the time when the meter was made, and the units the values will be in
	checkType(made, "When");
	var recent = made; // The most recent time we previously encountered

	var o = {};
	o.m = m; // Access a component meter like meter.m.speed25.answer()
	o.record = function(v, w) { // Value to record, and optional time when it was recorded
		if (!w) w = now(); else checkType(w, "When");
		if (w.time < recent.time) toss("bounds", {note:"record earlier time", watch:{recent:recent, w:w}}); // Make sure time moves forward
		recent = w;

		min0(v); // Negative values aren't allowed, values of 0 are ok
		for (var i in m) m[i].record(v, w);
	}
	o.finish = function(w) { // Optional time now
		if (!w) w = now(); else checkType(w, "When");
		for (var i in m) {
			if (hasMethod(m[i], "finish")) m[i].finish(w); // Tell each meter that whatever we're recording has finished
		}
	}
	o.text = function() {
		var s = lines(unit, "");
		for (var i in m) s += lines("==" + i, m[i]);
		return s;
	}
	return o;
}

// A simple meter that counts records and values and computes averages
function CountMeter(made) { // The time when this meter was made and started
	var o = {};

	var finished = null; // When the meter was marked as finished, null before finished

	var records = 0;
	var total = -1;

	var lowestValue   = -1;
	var highestValue  = -1;
	var earliestValue = -1;
	var recentValue   = -1;

	var lowestWhen   = null;
	var highestWhen  = null;
	var earliestWhen = null;
	var recentWhen   = null;

	o.record = function(v, w) {//value to record, and time very recently when it was recorded

		//records and total
		records++;
		if (total == -1) total = 0;
		total += v;

		//lowest and highest
		if (lowestValue == -1 || v < lowestValue) {//no winner or v wins
			lowestValue = v;
			lowestWhen = w;
		}
		if (highestValue == -1 || v > highestValue) {//no winner or v wins
			highestValue = v;
			highestWhen = w;
		}

		//earliest and most recent
		if (earliestValue == -1) {//set once for the first value
			earliestValue = v;
			earliestWhen = w;
		}
		recentValue = v;//set for every value
		recentWhen = w;
	}
	o.finish = function(w) { finished = w; }

	/*
	How many values we have recorded, and their total, and average
	Starting empty, records is 0, total is -1, and average is null
	Then with one or more records, records is 1+, total is 0+
	You can pass average a scale m like 1000 to get an integer average like 50,123 meaning 50.123

	The lowest and highest values we've recorded, and when they happened
	The earliest and most recent values we've recorded, and when they happened
	Starting empty, values are -1 and when is null
	*/

	o.made    = function() { return made;    }
	o.records = function() { return records; }
	o.total   = function() { return total;   }

	o.hasLowest     = function() { return lowestValue   != -1; }
	o.hasHighest    = function() { return highestValue  != -1; }
	o.hasEarliest   = function() { return earliestValue != -1; }
	o.hasRecent     = function() { return recentValue   != -1; }

	o.lowestValue   = function() { return lowestValue;   }
	o.highestValue  = function() { return highestValue;  }
	o.earliestValue = function() { return earliestValue; }
	o.recentValue   = function() { return recentValue;   }

	o.lowestWhen    = function() { return lowestWhen;    }
	o.highestWhen   = function() { return highestWhen;   }
	o.earliestWhen  = function() { return earliestWhen;  }
	o.recentWhen    = function() { return recentWhen;    }

	// The time when the most recent thing happened here
	// When this meter was made, or when we got the last value, or when the meter was marked as finished
	// Useful for noticing when nothing has happened in a long time, and enforcing a timeout
	o.recent = function() {
		if (finished) return finished;
		else if (recentWhen) return recentWhen;
		else return made;
	}
	// When the meter was made to when it was marked finished, null if not finished
	o.duration = function() {
		if (!finished) return null;
		return Duration(made, finished);
	}

	/*
	averagePerRecord() is useful if the records are like test scores and it doesn't matter when they happened
	averagePerTime(start, finish, now) totals all the values and divides by the given time duration denominator

	s:  made        When the meter was made (default)
	    earliest    When the earliest record happened

	f:  now         The time now
	    recent      When the most recent record happened
	    finish      When the meter was marked finished
	    now|finish  When the meter was marked finished, or now if not finished (default)

	If there are no records, or we're still in the same millisecond, averagePerTime() returns null instead of the fraction
	*/
	o.averagePerRecord = function() {
		if (!records) return null;
		return Fraction(total, records);
	}
	o.averagePerTime = function(s, f, n) { // Takes optional time now
		if (!n) n = now(); else checkType(n, "When");
		if (!records) return null;

		var d; // Compose the time duration to use as the denominator in milliseconds
		if      (s == "made"       || !s) {                   d = made;                                           }
		else if (s == "earliest")         { if (earliestWhen) d = earliestWhen;           else return null;	      }
		else                              {                                                    toss("invalid");   }

		if      (f == "now")              {                   d = d.duration(n);                                  }
		else if (f == "recent")           { if (recentWhen)   d = d.duration(recentWhen); else return null;       }
		else if (f == "finish")           { if (finished)     d = d.duration(finished);   else return null;       }
		else if (f == "finish|now" || !f) { if (finished)     d = d.duration(finished);   else d = d.duration(n); }
		else                              {                                                    toss("invalid");   }

		if (d.time < 1) return null;
		return {f:Fraction(total, d.time), duration:d}; // Also return the duration we used
	}
	o.text = function() {
		return table([
			["made",             o.made()],
			["recent",           say(o.recent(), " age ", sayTime(o.recent().age()))], // Show when and how long ago
			["duration",         o.duration()],
			["",                 ""],
			["total",            commas(o.total())],
			["records",          commas(o.records())],
			["averagePerRecord", sayUnitPerUnit(o.averagePerRecord(), "#.### (#/#)", "round")],
			["averagePerTime",   sayUnitPerTime(o.averagePerTime(), "#.###/s (#/#)", "round")]]) // Using the defaults, same as lower left below
			+ line() + table([
			["",           "made",                                                                           "earliest"],
			["now",        sayUnitPerTime(o.averagePerTime("made", "now"),        "#.###/s (#/#)", "round"), sayUnitPerTime(o.averagePerTime("earliest", "now"),        "#.###/s (#/#)", "round")],
			["recent",     sayUnitPerTime(o.averagePerTime("made", "recent"),     "#.###/s (#/#)", "round"), sayUnitPerTime(o.averagePerTime("earliest", "recent"),     "#.###/s (#/#)", "round")],
			["finish",     sayUnitPerTime(o.averagePerTime("made", "finish"),     "#.###/s (#/#)", "round"), sayUnitPerTime(o.averagePerTime("earliest", "finish"),     "#.###/s (#/#)", "round")],
			["finish|now", sayUnitPerTime(o.averagePerTime("made", "finish|now"), "#.###/s (#/#)", "round"), sayUnitPerTime(o.averagePerTime("earliest", "finish|now"), "#.###/s (#/#)", "round")]])
			+ line() + table([
			["",         "has",           "value",           "when"],
			["lowest",   o.hasLowest(),   o.lowestValue(),   o.lowestWhen()],
			["highest",  o.hasHighest(),  o.highestValue(),  o.highestWhen()],
			["earliest", o.hasEarliest(), o.earliestValue(), o.earliestWhen()],
			["recent",   o.hasRecent(),   o.recentValue(),   o.recentWhen()]]);
	}
	return o;
}

// Tell a SpeedMeter distances traveled or counts when they happen, and get the current speed
// Takes the time when the meter was made, which is the start of column 0
// Given a column width of 100, the meter will remember what happened in the last 100-200 milliseconds to calculate the current speed
// Set a guard like 100 milliseconds to avoid reporting huge or inaccurate speeds at the very start
function SpeedMeter(made, p) {
	min1(p.width);
	min1(p.guard);
	var o = {};

	var column   = 0; // The column index, 0 or more, we last added a record to
	var current  = 0; // The total distance recorded in that column of time
	var previous = 0; // The total distance we recorded in the previous column of time

	// Find out how fast we're going at the given time right now w
	o.speed = function(w) { return o.record(0, w); } // 0 to not record that we traveled a new distance step forward

	// The time right now is w, and we just traveled a distance of v additional units forward, calculate our speed right now
	o.record = function(v, w) {
		min0(v);

		var f = Fraction(w.time - made.time, p.width);
		var i = f.whole.toNumber();     // The column index, 0 or more, that the current time w places us in now
		var t = f.remainder.toNumber(); // How long we've been in the current column

		if (i != 0) t += p.width;       // After column 0, we also have distances from the previous column in time

		if (column == i) {              // We're still in the same column we last added a distance to, no cycle necessary
		} else if (column + 1 == i) {   // Time has moved us into the next column
			previous = current;           // Cycle the totals
			current = 0;
		} else {                        // Time has moved us two or more columns forward
			previous = 0;                 // Zero both totals
			current = 0;
		}

		current += v; // Add any given distance to the current total
		column = i;   // Record the column number we put it in, and the column we cycled to above

		if (t < p.guard) return null; // Avoid reporting huge or inaccurate speeds at the very start
		return Fraction(previous + current, t); // Rate is distance over time
	}

	o.text = function() {
		var a = o.speed(now());
		if (!a) return "width #, speed unknown".fill(sayTime(p.width));
		else    return "width #, speed #".fill(sayTime(p.width), sayUnitPerTime(a, "#.###/s (#/#)", "round"));
	}
	return o;
}

function EdgeMeter(made, p) {
	min1(p.capacity);

	var records = 0;
	var lowest  = SortedList(compareNumber);
	var highest = SortedList(function (n1, n2) { return -compareNumber(n1, n2); }); // Reverse order so highest is first

	var o = {};
	o.records    = function()  { return records;         } // How many records have passed through
	o.capacity   = function()  { return capacity;        } // How many records each list can hold
	o.length     = function()  { return lowest.length(); } // How many records each list is holding
	o.getLowest  = function(i) { return lowest.get(i);   } // getLowest(0) is the lowest, (1) second lowest
	o.getHighest = function(i) { return highest.get(i);  } // getHighest(0) is the highest, (1) second highest

	o.record = function(v) {
		records++;
		if      (lowest.length() < p.capacity)    {                                 lowest.add(v);  } // Not full, everybody wins
		else if (v < lowest.get(p.capacity - 1))  { lowest.remove(p.capacity - 1);  lowest.add(v);  } // Beats our weakest
		if      (highest.length() < p.capacity)   {                                 highest.add(v); }
		else if (v > highest.get(p.capacity - 1)) { highest.remove(p.capacity - 1); highest.add(v); }
	}
	o.text = function() {
		function f(l) {
			var s = "";
			for (var i = 0; i < l.length(); i++) s += say(l.get(i), " ");
			return s;
		}
		var s = "";
		s += line("# length, # capacity, # records".fill(commas(o.length()), commas(p.capacity), commas(o.records())));
		s += line();
		s += line("lowest:  ", f(lowest));
		s += line("highest: ", f(highest));
		return s;
	}
	return o;
}












function SampleMeter(made, p) {
	min1(p.capacity);

	function even(n) { return Fraction(n, 2).remainder.toNumber() == 0; }  // True if n is even, false if n is odd
	function randomMiddle(n) {
		if (!even(n)) return Fraction(n, 2).whole.toNumber();                // Odd stored, return the index to the middle one
		else          return Fraction(n, 2).whole.toNumber() - random(0, 1); // Even stored, randomly pick left or right of the middle
	}

	var records = 0; // How many records this meter has seen
	var capacity = even(p.capacity) ? p.capacity + 1 : p.capacity; // Make odd so there is an exact middle when full
	var list = p.keepSorted ? SortedList(compareNumber) : List(compareNumber);
	var middle = -1; // Index to middle cell in the list

	var o = {};
	o.records  = function()  { return records;                 } // How many records we've seen
	o.capacity = function()  { return capacity;                } // How many records we can hold
	o.length   = function()  { return list.length();           } // How many records we're holding
	o.get      = function(i) { return list.get(i);             } // Get the record at index i
	o.sort     = function()  { if (!p.keepSorted) list.sort(); } // Sort the records
	o.median   = function()  { if (middle == -1) { return null; } else { o.sort(); return list.get(middle); } } // Get the middle record

	o.record = function(v) {
		records++;
		if (list.length() < capacity) {                // Not full yet, so keep everything
			list.add(v);
			middle = randomMiddle(list.length());        // Choose in record(), not median(), so the answer doesn't change unless the data does
		} else {                                       // Full, randomly keep or let pass by so list always holds a representative sample
			if (chance(list.length(), records)) {        // Our new value is lucky enough to get included in our random sample
				list.remove(random(0, list.length() - 1)); // Randomly pick a value we have and discard it
				list.add(v);                               // Adds in sorted position if p.keepSorted, or on the end if not, which is ok
			}
		}
	}
	o.text = function() {
		var s = "holding #/# from #".fill(commas(list.length()), commas(capacity), items(records, "record"));
		if (records) s += ", sample represents " + sayUnitPerUnit(Fraction(list.length(), records), "#.###% #/#");
		s += line();
		if (middle != -1) {
			var m = o.median(); // Getting the median sorts the list if it doesn't keep sorted
			s += line("middle at # is median value # which is # and #".fill(middle, commas(m), saySize(m), sayTime(m)))
		} else { s += line(); }
		s += line();
		for (var i = 0; i < list.length(); i++) s += say(list.get(i)) + (Fraction(i + 1, p.wrap).remainder.toNumber() ? " ": line());
		return s;
	}
	return o;
}

//maybe seriously get rid of wrap and let stick wrap, and the later html thing will do a good job, too
//makes the code simpler, and eliminates a display preset, which isn't the best











function columnSame(p) { // Count the number of value that fall within n columns of width w, starting at index i
	min0(p.i); // Columns can start at the beginning, value 0, or to the right of that
	min1(p.w); // Columns have to be at least 1 unit wide
	min1(p.n); // There has to be at least 1 column

	var h = {};
	h.records = 0; // Total number of records also entered into the different columns of f
	h.c = [];      // Right edges of each column
	h.f = [];      // Frequency of records with values in those columns

	var i = 0;              // Column index as we loop
	var edge = p.i;         // Distance to right edge of each column as we loop
	if (!edge) edge += p.w; // No margin column at the start
	var rightmostEdge = p.i + (p.w * p.n);
	while (edge <= rightmostEdge) {
		h.c[i] = edge;        // Right edge of this column
		h.f[i] = 0;           // No values recorded yet
		i++;                  // Move to the next column
		edge += p.w;          // The right edge will be another width farther there
	}
	h.c[i] = "higher"; // The final column is for values that are higher than the rightmost edge
	h.f[i] = 0;
	return h;
}
function columnScale(p) { // Count the number of values that are beneath powers of 2, like <1, <2, <4, <8, all the way up to <4pb
	min1(p.rightmostEdge);

	var h = {};
	h.records = 0; // Total number of records also entered into the different columns of f
	h.c = [];      // Right edges of each column
	h.f = [];      // Frequency of records with values in those columns

	var i = 0;       // Column index as we loop
	var edge = 1;    // Distance to right edge of the first column, only 0 is less and fits here, and each column as we loop
	while (edge <= p.rightmostEdge) {
		h.c[i] = edge; // Right edge of this column
		h.f[i] = 0;    // No values recorded yet
		i++;           // Move to the next column
		edge *= 2;     // The right edge will be twice as high there
	}
	h.c[i] = "higher"; // The final column is for values that are higher than the rightmost edge
	h.f[i] = 0;
	return h;
}
function ColumnMeter(made, h) { // Given variables to hold columns, make a meter which keeps a histogram

	var o = {};
	o.record = function(v) { // This meter doesn't care when any values were recorded
		for (var i = 0; i < h.c.length; i++) {
			if (i < h.c.length - 1) { // i is before the last column
				if (v < h.c[i]) {       // The new value is under the ceiling for this column
					h.f[i]++;             // Count it
					h.records++;
					break;              // leave to only count it here
				}
			} else {                // i is on the last column
				h.f[i]++;               // no ceiling here, count it
				h.records++;
			}
		}
	}

	o.length = function() { return h.c.length; } // Loop through the current results
	o.get = function(i) {                        // Get a result
		if (i < 0 || i > h.c.length) return null;
		return { ceiling:h.c[i], records:h.f[i] };
	}
	o.records = function() { return h.records; } // Number of records, not the total of the values
	o.text = function() {
		function p(n, d) { // Say a percent
			if (!n || !d) return "";
			return commas(scale(100*1000, n, d).round, 3) + "%";
		}
		var s = "recorded n values < ceiling, as size, as time, and percents of # records".fill(commas(h.records));
		var t = [];
		t.add(["n",  "%",  "ceiling", "as size", "as time"]);
		t.add(["--", "--", "--",      "--",      "--"]);
		for (var i = 0; i < o.length(); i++) {
			if (i < o.length() - 1) t.add([commas(h.f[i]), p(h.f[i], h.records), commas(h.c[i]), saySize(h.c[i]), sayTime(h.c[i])]);
			else                    t.add([commas(h.f[i]), p(h.f[i], h.records), "higher",       "",              ""]);
		}
		return line(s) + line() + table(t);
	}
	return o;
}





























});
console.log("meter core/");