
require("./load").load("base", function() { return this; });








if (demo("meter-heavy")) { demoMeter(meterDemoHeavy()); }
if (demo("meter-light")) { demoMeter(meterDemoLight()); }

if (demo("meter-unitperunit")) { demoMeter(meterDemoUnitPerUnit()); }
if (demo("meter-unitpertime")) { demoMeter(meterDemoUnitPerTime()); }
if (demo("meter-sizeperunit")) { demoMeter(meterDemoSizePerUnit()); }
if (demo("meter-sizepertime")) { demoMeter(meterDemoSizePerTime()); }

if (demo("meter-shortcut")) { demoMeter(meterDemoShortcut()); }
if (demo("meter-dual"))     { demoMeter(meterDemoDual());     }
if (demo("meter-interval")) { demoMeter(meterDemoInterval()); }

if (demo("meter-count"))  { demoMeter(meterDemoCount());  }
if (demo("meter-speed"))  { demoMeter(meterDemoSpeed());  }
if (demo("meter-edge"))   { demoMeter(meterDemoEdge());   }
if (demo("meter-sample")) { demoMeter(meterDemoSample()); }

if (demo("meter-column1")) { demoMeter(meterDemoColumn1()); }
if (demo("meter-column2")) { demoMeter(meterDemoColumn2()); }
if (demo("meter-column3")) { demoMeter(meterDemoColumn3()); }
if (demo("meter-column4")) { demoMeter(meterDemoColumn4()); }

function demoMeter(meter) {

	function ScreenResource() {
		var o = mustClose();
		o.close = function() {
			if (o.alreadyClosed()) return;
		};
		o.pulseScreen = function() {
			stick(meter);
		}
		return o;
	};
	var r = ScreenResource();

	keyboard("any", function(key) {//blank to get all the events
		if (key.character == "f") {
			meter.finish();
		} else {
			var i;
			try { i = number(key.character); } catch (e) { return; }//the user typed a key other than 0-9
			meter.record(i);
		}
	});

	keyboard("exit", function() {
		close(r);
		closeKeyboard();
		closeCheck();
	});
}


















//you do'nt need these anymore, delete them, replaced by the function w
//times
var w0 = When(Time.year + 0*Time.second);//midnight on january 1, 1971
var w1 = When(Time.year + 1*Time.second);//one second later
var w2 = When(Time.year + 2*Time.second);
var w3 = When(Time.year + 3*Time.second);
var w4 = When(Time.year + 4*Time.second);
var w5 = When(Time.year + 5*Time.second);
var w6 = When(Time.year + 6*Time.second);
var w7 = When(Time.year + 7*Time.second);
var w8 = When(Time.year + 8*Time.second);







function w(n) { return When(Time.year + (n*Time.second)); }//midnight on january 1, 1971 plus n seconds later

exports.testMeterCountLowest = function(test) {//lowest, highest, earliest, most recent

	var m = meterDemoCount(w(0));

	//empty
	test.ok(m.m.count.made().time = w(0).time);
	test.ok(m.m.count.records() == 0);
	test.ok(m.m.count.total() == -1);

	test.ok(!m.m.count.hasLowest());
	test.ok(!m.m.count.hasHighest());
	test.ok(!m.m.count.hasEarliest());
	test.ok(!m.m.count.hasRecent());

	//single
	m.record(5, w(1));
	test.ok(m.m.count.records() == 1);
	test.ok(m.m.count.total() == 5);

	test.ok(m.m.count.hasLowest());
	test.ok(m.m.count.hasHighest());
	test.ok(m.m.count.hasEarliest());
	test.ok(m.m.count.hasRecent());

	//higher
	test.ok(m.m.count.highestValue() == 5);
	test.ok(m.m.count.highestWhen().time == w(1).time);
	m.record(6, w(2));
	test.ok(m.m.count.highestValue() == 6);
	test.ok(m.m.count.highestWhen().time == w(2).time);

	//lower
	test.ok(m.m.count.lowestValue() == 5);
	test.ok(m.m.count.lowestWhen().time == w(1).time);
	m.record(4, w(3));
	test.ok(m.m.count.lowestValue() == 4);
	test.ok(m.m.count.lowestWhen().time == w(3).time);

	//earliest
	test.ok(m.m.count.earliestValue() == 5);
	test.ok(m.m.count.earliestWhen().time == w(1).time);

	//more recent
	test.ok(m.m.count.recentValue() == 4);
	test.ok(m.m.count.recentWhen().time == w(3).time);
	m.record(9, w(4));
	test.ok(m.m.count.recentValue() == 9);
	test.ok(m.m.count.recentWhen().time == w(4).time);

	done(test);
}

exports.testMeterCountRecent = function(test) {//most recent thing that's happened

	var m = meterDemoCount(w(0));
	test.ok(m.m.count.recent().time = w(0).time);
	m.record(5, w(1));
	test.ok(m.m.count.recent().time = w(1).time);
	m.record(5, w(2));
	test.ok(m.m.count.recent().time = w(2).time);

	done(test);
}

exports.testMeterCountAverage = function(test) {//different kinds of averages

	var m = meterDemoCount(w0);//make at 0 seconds
	m.record(10, w(1));//record 4 values at seconds 1, 2, 3, and 4
	m.record(10, w(2));
	m.record(10, w(3));
	m.record(10, w(4));

	a1 = m.m.count.averagePerRecord();
	a2 = m.m.count.averagePerTime("made", "now", w5);//check the averages at 5 seconds
	a3 = m.m.count.averagePerTime("earliest", "now", w5);

	test.ok(a1.n == 40 && a1.d == 4);//4 records
	test.ok(a2.n == 40 && a2.d == 5*Time.second);//5 seconds since made
	test.ok(a3.n == 40 && a3.d == 4*Time.second);//4 seconds since first record

	done(test);
}

exports.testMeterCountAverageNow = function(test) {//checking the average too soon

	var m = meterDemoCount(w(0));//new empty meter
	test.ok(!m.m.count.averagePerRecord());//no averages yet, divide() returns null instead of an answer object
	test.ok(!m.m.count.averagePerTime("made", "now"));
	test.ok(!m.m.count.averagePerTime("earliest", "now"));

	m.record(5, w(1));//record the first value at 1 second
	test.ok(m.m.count.averagePerRecord().d == 1);//now you have an average of records
	test.ok(m.m.count.averagePerTime("made", "now", w1).d == Time.second);//and can check the average over time
	test.ok(!m.m.count.averagePerTime("earliest", "now", w(1)));//but not since the first record

	m.record(5, w(2));//a second value a second later
	test.ok(m.m.count.averagePerRecord().d == 2);//all the averages work now
	test.ok(m.m.count.averagePerTime("made", "now", w(2)).d == 2*Time.second);//2 seconds since made
	test.ok(m.m.count.averagePerTime("earliest", "now", w(2)).d == Time.second);//1 second since first record

	done(test);
}

exports.testMeterCountAverageRecords = function(test) {//using like average test scores

	var m = meterDemoCount();
	test.ok(!m.m.count.averagePerRecord());
	m.record(0);
	test.ok(m.m.count.averagePerRecord().whole == 0);
	m.record(10);
	test.ok(m.m.count.averagePerRecord().whole == 5);
	m.record(123);
	m.record(7);
	m.record(0);
	m.record(99);
	test.ok(m.m.count.averagePerRecord().whole == 39);
	test.ok(m.m.count.averagePerRecord().round == 40);

	done(test);
}

exports.testMeterCountFinish = function(test) {//finish

	var m = meterDemoCount(w(0));
	test.ok(!m.m.count.duration());//not finished
	m.finish(w(1));
	test.ok(m.m.count.duration().start.time == w0.time);//finished
	test.ok(m.m.count.duration().finish.time == w1.time);

	var h = w(0);
	m = meterDemoCount(h); // made

	h = w(1);
	test.ok(!m.m.count.averagePerTime("made",     "now",        h));//all the time averages are null
	test.ok(!m.m.count.averagePerTime("made",     "recent",     h));
	test.ok(!m.m.count.averagePerTime("made",     "finish",     h));
	test.ok(!m.m.count.averagePerTime("made",     "finish|now", h));
	test.ok(!m.m.count.averagePerTime("earliest", "now",        h));
	test.ok(!m.m.count.averagePerTime("earliest", "recent",     h));
	test.ok(!m.m.count.averagePerTime("earliest", "finish",     h));
	test.ok(!m.m.count.averagePerTime("earliest", "finish|now", h));

	h = w(2);
	m.record(0, h); // earliest

	h = w3;
	test.ok( m.m.count.averagePerTime("made",     "now",        h).d == 3*Time.second);
	test.ok( m.m.count.averagePerTime("made",     "recent",     h).d == 2*Time.second);
	test.ok(!m.m.count.averagePerTime("made",     "finish",     h));
	test.ok( m.m.count.averagePerTime("made",     "finish|now", h).d == 3*Time.second);
	test.ok( m.m.count.averagePerTime("earliest", "now",        h).d == 1*Time.second);
	test.ok(!m.m.count.averagePerTime("earliest", "recent",     h));
	test.ok(!m.m.count.averagePerTime("earliest", "finish",     h));
	test.ok( m.m.count.averagePerTime("earliest", "finish|now", h).d == 1*Time.second);

	h = w(4);
	m.record(0, h); // most recent

	h = w(5);
	test.ok( m.m.count.averagePerTime("made",     "now",        h).d == 5*Time.second);
	test.ok( m.m.count.averagePerTime("made",     "recent",     h).d == 4*Time.second);
	test.ok(!m.m.count.averagePerTime("made",     "finish",     h));
	test.ok( m.m.count.averagePerTime("made",     "finish|now", h).d == 5*Time.second);//uses now
	test.ok( m.m.count.averagePerTime("earliest", "now",        h).d == 3*Time.second);
	test.ok( m.m.count.averagePerTime("earliest", "recent",     h).d == 2*Time.second);
	test.ok(!m.m.count.averagePerTime("earliest", "finish",     h));
	test.ok( m.m.count.averagePerTime("earliest", "finish|now", h).d == 3*Time.second);//uses now

	h = w(6);
	m.finish(h); // finish

	h = w(7);
	test.ok( m.m.count.averagePerTime("made",     "now",        h).d == 7*Time.second);
	test.ok( m.m.count.averagePerTime("made",     "recent",     h).d == 4*Time.second);
	test.ok( m.m.count.averagePerTime("made",     "finish",     h).d == 6*Time.second);
	test.ok( m.m.count.averagePerTime("made",     "finish|now", h).d == 6*Time.second);//uses finish
	test.ok( m.m.count.averagePerTime("earliest", "now",        h).d == 5*Time.second);
	test.ok( m.m.count.averagePerTime("earliest", "recent",     h).d == 2*Time.second);
	test.ok( m.m.count.averagePerTime("earliest", "finish",     h).d == 4*Time.second);
	test.ok( m.m.count.averagePerTime("earliest", "finish|now", h).d == 4*Time.second);//uses finish

	var a = m.m.count.averagePerTime();//default
	test.ok(a.duration.start.time == w(0).time);//made
	test.ok(a.duration.finish.time == w(6).time);//finished
	test.ok(a.duration.time == 6*Time.second);

	done(test);
}




//great, but turn into a test that you can repeat by pressing r or something
/*

exports.testMeterSample = function(test) {//finish

	var n = 1000;
	var a;



	function d() {

	log();
	a = meterDemoCount();
	for (var c = 0; c < 20; c++) {
		var m = meterDemoSample();
		for (var i = 0; i < n; i++) m.record(0);
		for (var i = 0; i < n; i++) m.record(1);
		var t = f(m);
		a.record(t);
	}
	log("0 then 1: ", sayUnitPerUnit(a.m.count.averagePerRecord()));

	a = meterDemoCount();
	for (var c = 0; c < 20; c++) {
		var m = meterDemoSample();
		for (var i = 0; i < n; i++) m.record(1);
		for (var i = 0; i < n; i++) m.record(0);
		var t = f(m);
		a.record(t);
	}
	log("1 then 0: ", sayUnitPerUnit(a.m.count.averagePerRecord()));

	a = meterDemoCount();
	for (var c = 0; c < 20; c++) {
		var m = meterDemoSample();
		for (var i = 0; i < n; i++) { m.record(0); m.record(1); }
		var t = f(m);
		a.record(t);
	}
	log("together: ", sayUnitPerUnit(a.m.count.averagePerRecord()));

	}

	for (var k = 0; k < 5; k++) d();


	function f(m) {
		var t = 0;
		for (var i = 0; i < m.m.sample.length(); i++) t += m.m.sample.get(i);
		return t;
	}




	done(test);
}

*/








