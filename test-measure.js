
var log = console.log;

var requireText = require("./text");
var hasMethod = requireText.hasMethod;
var getType = requireText.getType;
var isType = requireText.isType;
var checkType = requireText.checkType;

var make = requireText.make;
var say = requireText.say;
var numerals16 = requireText.numerals16;

var requireMeasure = require("./measure");
var Time = requireMeasure.Time;
var Size = requireMeasure.Size;

var requireData = require("./data");
var Data = requireData.Data;
var Bay = requireData.Bay;




























//   _   _       _ _       
//  | | | |_ __ (_) |_ ___ 
//  | | | | '_ \| | __/ __|
//  | |_| | | | | | |_\__ \
//   \___/|_| |_|_|\__|___/
//                         

exports.testUnits = function(test) {

	test.ok(Size.kb == 1024);
	Size.kb = 5;//this won't change it, but also won't throw an exception
	test.ok(Size.kb == 1024);//make sure Objet.freeze() worked

	test.done();
}










//   __  __       _   _     
//  |  \/  | __ _| |_| |__  
//  | |\/| |/ _` | __| '_ \ 
//  | |  | | (_| | |_| | | |
//  |_|  |_|\__,_|\__|_| |_|
//                          

var multiply = requireMeasure.multiply;
var divide = requireMeasure.divide;
var scale = requireMeasure.scale;
var check = requireMeasure.check;

exports.testNumberNanInfinity = function(test) {

	var n;

	n = 1 / 1;//number
	test.ok(typeof n == "number");
	test.ok(!isNaN(n));
	test.ok(isFinite(n));
	test.ok(n + "" == "1");

	n = 0 / 0;//nan
	test.ok(typeof n == "number");
	test.ok(isNaN(n));
	test.ok(!isFinite(n));
	test.ok(n + "" == "NaN");

	n = 1 / 0;//infinity
	test.ok(typeof n == "number");
	test.ok(!isNaN(n));
	test.ok(!isFinite(n));
	test.ok(n + "" == "Infinity");

	test.done();
}

exports.testNumberBig = function(test) {

	var n;

	n = Number.MAX_VALUE;
	test.ok(n + "" == "1.7976931348623157e+308");//largest value that a number can hold, not an integer

	n = n * 2;
	test.ok(typeof n == "number");
	test.ok(!isNaN(n));
	test.ok(!isFinite(n));
	test.ok(n + "" == "Infinity");

	n = 9007199254740992;//largest number that javascript can handle as an integer, 2^53
	test.ok( n - 1      ==  9007199254740991);//subtracting works
	test.ok( n + 0      ==  9007199254740992);
	test.ok( n + 1      ==  9007199254740992);//adding doesn't, no change, doesn't throw
	test.ok( n * 1      ==  9007199254740992);
	test.ok( n * 2      == 18014398509481984);//multiplying does work, somehow
	test.ok((n * 2) + 1 == 18014398509481984);//but then adding doesn't change it

	//clever code you came up with to detect this problem
	test.ok(n + 1 === n);

	//example of working with a very large file size
	var d = divide(9007199254740992 - 1, Size.tb);//the biggest number divide and multiply will work with is 1 less than the int limit
	test.ok(d.whole == 8191);// the size limit is 8191 terabytes
	test.ok(d.remainder == 1099511627775);//and this remainder of bytes
	test.ok(divide(d.remainder, Size.gb).whole == 1023);//which is 1023 gigabytes
	test.ok(multiply(8191, Size.tb) + 1099511627775 == 9007199254740992 - 1);//put the number back together again

	test.done();
}

exports.testCheck = function(test) {

	//hit each of the 7 exceptions in check
	try { check("1", 0); test.fail() } catch (e) { test.ok(e == "type"); }//make sure i is a number
	try { check(0 / 0, 0); test.fail() } catch (e) { test.ok(e == "bounds"); }//not the weird not a number thing
	try { check(1 / 0, 0); test.fail() } catch (e) { test.ok(e == "overflow"); }//not too big for floating point
	try { check(9007199254740992 * 2, 0); test.fail() } catch (e) { test.ok(e == "overflow"); }//not too big for int
	try { check(9007199254740900 + 92, 0); test.fail() } catch (e) { test.ok(e == "overflow"); }//not too big for addition to work
	try { check(1.5, 0); test.fail() } catch (e) { test.ok(e == "type"); }//a whole number
	try { check(0, 1); test.fail() } catch (e) { test.ok(e == "bounds"); }//with the minimum value or larger

	test.done();
}

exports.testMultiply = function(test) {

	test.ok(multiply(3, 4) == 12);
	test.ok(multiply(3, 0) == 0);
	test.ok(multiply(1, 1) == 1);

	//a big number
	var n = 9007199254740992 - 1;//largest possible int, minus 1 so our functions will work with it
	test.ok(n == 9007199254740991);

	//divide
	var d = divide(n, 1000);
	test.ok(d.whole == 9007199254740);//easy enough to see the whole and remainder
	test.ok(d.remainder == 991);

	//multiply
	test.ok(multiply(9007199254740, 1000) == 9007199254740000);//multiply to near, but under the limit
	try {
		multiply(9007199254740, 1001);//over the limit
		test.fail();
	} catch (e) { test.ok(e == "overflow"); }

	test.done();
}

exports.testDivide = function(test) {

	var a;

	a = divide(10, 3);
	test.ok(a.whole == 3 && a.remainder == 1);
	test.ok(a.remainder);//has a remainder

	a = divide(12, 3);
	test.ok(a.whole == 4 && a.remainder == 0);
	test.ok(!a.remainder);//doesn't have a remainder

	a = divide(123456789, 555);
	test.ok(a.whole == 222444 && a.remainder == 369);

	a = divide(789, 1);
	test.ok(a.whole == 789 && a.remainder == 0);

	a = divide(1, 2);
	test.ok(a.whole == 0 && a.remainder == 1);

	a = divide(1, 456);
	test.ok(a.whole == 0 && a.remainder == 1);

	//catch errors
	try { divide("potato", 1); test.fail(); } catch (e) { test.ok(e == "type");    }//not a number
	try { divide(1.5, 1);      test.fail(); } catch (e) { test.ok(e == "type");    }//not an integer
	try { divide(-2, 1);       test.fail(); } catch (e) { test.ok(e == "bounds");  }//negative
	try { divide(10, 0);       test.fail(); } catch (e) { test.ok(e == "bounds");  }//divide by zero

	test.done();
}

exports.testScale = function(test) {

	var d = scale(5, 10, 3);//multiplies first to not lose accuracy
	test.ok(d.whole == 16);
	test.ok(d.remainder == 2);

	test.done();
}


















var Average = requireMeasure.Average;

exports.testAverage = function(test) {

	//average 4, 5, and 6
	var a = Average();
	test.ok(!a.minimum());
	a.add(4);
	a.add(5);
	test.ok(a.recent() == 5);
	test.ok(a.maximum() == 5);
	a.add(6);

	test.ok(a.n() == 3);
	test.ok(a.total() == 15);
	test.ok(a.minimum() == 4);
	test.ok(a.maximum() == 6);
	test.ok(a.recent() == 6);

	test.ok(a.average() == 5);

	//average 3, 3, and 4
	a = Average();
	a.add(3);
	a.add(3);
	a.add(4);
	test.ok(a.average() == 3);
	test.ok(a.averageFloat() == 3.3333333333333335);
	test.ok(a.averageThousandths() == 3333);

	test.done();
}















//   _____ _                
//  |_   _(_)_ __ ___   ___ 
//    | | | | '_ ` _ \ / _ \
//    | | | | | | | | |  __/
//    |_| |_|_| |_| |_|\___|
//                          

var now = requireMeasure.now;
var When = requireMeasure.When;
var earlier = requireMeasure.earlier;
var recent = requireMeasure.recent;
var Duration = requireMeasure.Duration;

exports.testWhenImmutable = function(test) {

	var w = now();//remember the time right now
	var time = w.time;//get it
	w.time = 7;//try to change it
	test.ok(time == w.time);//confirm that didn't work

	test.done();
}

exports.testWhen = function(test) {

	//load a saved time
	var w = When(1030338738133);
	test.ok(w.text() == "2002 Aug 26 Mon 1:12a 18.133s");

	test.done();
}






















/*
var Speed = requireMeasure.Speed;

exports.testSpeed = function(test) {


	var s = Speed(10*Time.second);
	s.distance(50*Size.mb);//50mb right now

	log("hi");
	setTimeout(function() {
		s.distance(50*Size.mb);//50mb a second later
		log(saySpeed(s.speed(Time.second)));//that's 100mb/s
		test.done();
	}, 1000);



}
*/
















//put this in measure number to watch out for it
/*
	test.ok((0 < 1) == true);
	test.ok((undefined < 1) == false);
*/






/*
log("hi");

var d = new Date();
log(d);//text for the user
log(d.getTime());//number of milliseconds since 1970
log(Date.now());
log(typeof Date.now());//number
*/







var Stripe2 = requireMeasure.Stripe2;

exports.testStripeFrozen = function(test) {

/*
	log("hi");

	var s = Stripe2(0, 1);
	log(s.text());
	log(s.text2);

	s.w = 2;//doesn't throw
	log(s.text());//still 1
	log(s.text2);
	*/




	test.done();
}

















//    ____      _ _                  
//   / ___|   _| | |_ _   _ _ __ ___ 
//  | |  | | | | | __| | | | '__/ _ \
//  | |__| |_| | | |_| |_| | | |  __/
//   \____\__,_|_|\__|\__,_|_|  \___|
//                                   









//   _   _                 _               
//  | \ | |_   _ _ __ ___ | |__   ___ _ __ 
//  |  \| | | | | '_ ` _ \| '_ \ / _ \ '__|
//  | |\  | |_| | | | | | | |_) |  __/ |   
//  |_| \_|\__,_|_| |_| |_|_.__/ \___|_|   
//                                         

var widen = requireMeasure.widen;
var commas = requireMeasure.commas;
var items = requireMeasure.items;

exports.testWiden = function(test) {

	test.ok(widen("1", 3) == "001");
	test.ok(widen("12", 3, " ") == " 12");

	test.done();
}

exports.testCommas = function(test) {

	test.ok(commas("1")        ==          "1");
	test.ok(commas("1234")     ==      "1,234");
	test.ok(commas("12345")    ==     "12,345");
	test.ok(commas("12345678") == "12,345,678");

	test.ok(commas("1",       3) ==     "0.001");
	test.ok(commas("12",      3) ==     "0.012");
	test.ok(commas("12345",   3) ==    "12.345");
	test.ok(commas("1234567", 3) == "1,234.567");

	test.done();
}

exports.testItems = function(test) {

	test.ok(items(0, "apple") == "0 apples");
	test.ok(items(1, "apple") == "1 apple");
	test.ok(items(2, "apple") == "2 apples");

	test.ok(items(12345, "apple") == "12,345 apples");

	test.done();
}







//   _____               _   _             
//  |  ___| __ __ _  ___| |_(_) ___  _ __  
//  | |_ | '__/ _` |/ __| __| |/ _ \| '_ \ 
//  |  _|| | | (_| | (__| |_| | (_) | | | |
//  |_|  |_|  \__,_|\___|\__|_|\___/|_| |_|
//                                         

var sayDivide = requireMeasure.sayDivide;
var sayPercent = requireMeasure.sayPercent;
var sayProgress = requireMeasure.sayProgress;

exports.testSayDivide = function(test) {

	test.ok(sayDivide(1, 2, 3) == "0.500");
	test.ok(sayDivide(10, 3, 3) == "3.333");
	test.ok(sayDivide(3000, 2, 3) == "1,500.000");

	test.ok(sayDivide(3227, 555, 0) == "5");
	test.ok(sayDivide(3227, 555, 1) == "5.8");
	test.ok(sayDivide(3227, 555, 2) == "5.81");
	test.ok(sayDivide(3227, 555, 3) == "5.814");
	test.ok(sayDivide(3227, 555, 4) == "5.8144");

	test.ok(sayDivide(22, 7, 8) == "3.14285714");

	test.done();
}

exports.testSayPercent = function(test) {

	test.ok(sayPercent(1, 2, 3) == "50.000% 1/2");
	test.ok(sayPercent(10, 30, 3) == "33.333% 10/30");

	test.done();
}

exports.testSayProgress = function(test) {

	test.ok(sayProgress(1, 2) == "50% 1b/2b");
	test.ok(sayProgress(1122*Size.mb, 18*Size.gb) == "6% 1122mb/18gb");
	test.ok(sayProgress(987*Size.kb, 5*Size.mb) == "19% 987kb/5120kb");
	test.ok(sayProgress(555*Size.mb, 7*Size.gb, 0, "kb") == "7% 568,320kb/7,340,032kb");

	test.ok(sayProgress(Size.mb, 2*Size.mb, 1, "kb") == "50.0% 1,024.0kb/2,048.0kb");

	test.done();
}












//   ____  _         
//  / ___|(_)_______ 
//  \___ \| |_  / _ \
//   ___) | |/ /  __/
//  |____/|_/___\___|
//                   

var Size = requireMeasure.Size;
var saySize = requireMeasure.saySize;

exports.testSaySize = function(test) {

	test.ok(saySize(0) == "0b");
	test.ok(saySize(5) == "5b");
	test.ok(saySize(9999) == "9999b");
	test.ok(saySize(10000) == "9kb");

	test.ok(saySize(256 * Size.kb) == "256kb");
	test.ok(saySize(5 * Size.gb) == "5120mb");
	test.ok(saySize(Size.tb) == "1024gb");

	test.ok(saySize(Size.max - 1) == "8191tb");

	test.ok(saySize(1)                == "1b");
	test.ok(saySize(10)               == "10b");
	test.ok(saySize(100)              == "100b");
	test.ok(saySize(1000)             == "1000b");
	test.ok(saySize(10000)            == "9kb");
	test.ok(saySize(100000)           == "97kb");
	test.ok(saySize(1000000)          == "976kb");
	test.ok(saySize(10000000)         == "9765kb");
	test.ok(saySize(100000000)        == "95mb");
	test.ok(saySize(1000000000)       == "953mb");
	test.ok(saySize(10000000000)      == "9536mb");
	test.ok(saySize(100000000000)     == "93gb");
	test.ok(saySize(1000000000000)    == "931gb");
	test.ok(saySize(10000000000000)   == "9313gb");
	test.ok(saySize(100000000000000)  == "90tb");
	test.ok(saySize(1000000000000000) == "909tb");

	var n = 5 * Size.gb;
	test.ok(saySize(n, 0, "b")  == "5,368,709,120b");
	test.ok(saySize(n, 0, "kb") == "5,242,880kb");
	test.ok(saySize(n, 0, "mb") == "5,120mb");
	test.ok(saySize(n, 0, "gb") == "5gb");
	test.ok(saySize(n, 0, "tb") == "0tb");
	test.ok(saySize(n, 0, "pb") == "0pb");

	n = Size.max - 1;
	test.ok(saySize(n, 0, "b")  == "9,007,199,254,740,991b");
	test.ok(saySize(n, 0, "kb") == "8,796,093,022,208kb");
	test.ok(saySize(n, 0, "mb") == "8,589,934,592mb");
	test.ok(saySize(n, 0, "gb") == "8,388,607gb");
	test.ok(saySize(n, 0, "tb") == "8,191tb");
	test.ok(saySize(n, 0, "pb") == "7pb");

	test.ok(saySize(9876543210, 3, "b")  == "9,876,543,210.000b");
	test.ok(saySize(9876543210, 3, "kb") == "9,645,061.729kb");
	test.ok(saySize(9876543210, 3, "mb") == "9,419.006mb");
	test.ok(saySize(9876543210, 3, "gb") == "9.198gb");
	test.ok(saySize(9876543210, 3, "tb") == "0.008tb");
	test.ok(saySize(9876543210, 3, "pb") == "0.000pb");

	test.ok(saySize(9876543210, 0, "gb") == "9gb");
	test.ok(saySize(9876543210, 1, "gb") == "9.1gb");
	test.ok(saySize(9876543210, 2, "gb") == "9.19gb");
	test.ok(saySize(9876543210, 3, "gb") == "9.198gb");
	test.ok(saySize(9876543210, 4, "gb") == "9.1982gb");
	test.ok(saySize(9876543210, 5, "gb") == "9.19824gb");

	test.done();
}









//   ____                      _ 
//  / ___| _ __   ___  ___  __| |
//  \___ \| '_ \ / _ \/ _ \/ _` |
//   ___) | |_) |  __/  __/ (_| |
//  |____/| .__/ \___|\___|\__,_|
//        |_|                    

var saySpeed = requireMeasure.saySpeed;
var saySpeedKbps = requireMeasure.saySpeedKbps;
var saySpeedTimePerMegabyte = requireMeasure.saySpeedTimePerMegabyte;

exports.testSaySpeedKbps = function(test) {

	function f(b, s) {
		test.ok(saySpeedKbps(b) == s);
	}

	f(0, "0.00kb/s");
	f(1, "0.00kb/s");//one byte per second

	f(Size.kb, "1.00kb/s");//exactly one kilobyte
	f(Size.kb - 1, "0.99kb/s");//one byte less
	f(divide(Size.kb, 2).whole, "0.50kb/s");//half a kilobyte
	f(Size.mb, "1,024kb/s");//megabyte

	f(9, "0.00kb/s");
	f(89, "0.08kb/s");
	f(789, "0.77kb/s");
	f(6789, "6.62kb/s");
	f(56789, "55.4kb/s");
	f(456789, "446kb/s");
	f(3456789, "3,375kb/s");
	f(23456789, "22,907kb/s");
	f(123456789, "120,563kb/s");

	test.done();
}

exports.testSaySpeedSecondsPerMegabyte = function(test) {

	function f(b, s) {
		test.ok(saySpeedTimePerMegabyte(b) == s);
	}

	f(0, "");//say blank instead of forever
	f(1, "12d/mb");//at 1 byte a second, it takes 12 days to get a megabyte
	f(2, "6d/mb");//twice that speed, half the time

	f(Size.mb, "1s/mb");//1mb/s is 1s/mb
	f(Size.mb + 1, "");//say blank instead of "0s/mb"

	test.done();
}












//   _____ _                
//  |_   _(_)_ __ ___   ___ 
//    | | | | '_ ` _ \ / _ \
//    | | | | | | | | |  __/
//    |_| |_|_| |_| |_|\___|
//                          

var sayTime = requireMeasure.sayTime;
var sayTimeRemaining = requireMeasure.sayTimeRemaining;
var sayTimeRace = requireMeasure.sayTimeRace;

exports.testSayTime = function(test) {

	function f(t, s) {
		test.ok(sayTime(t) == s);
	}

	f(0,    "0.000s");
	f(1,    "0.001s");
	f(56,   "0.056s");
	f(1500, "1.500s");

	f(59*Time.second + 21, "59.021s");
	f(90*Time.second, "1m 30.000s");
	f(Time.hour, "1h 0m 0.000s");//smaller units are zero
	f(Time.hour + 2000, "1h 0m 2.000s");//0m in the middle

	f(2*Time.day + 3*Time.hour + 4*Time.minute + 5*Time.second + 6, "2d 3h 4m 5.006s");

	f(Size.max - 1, "285,420y 11m 1d 13h 29m 0.991s");//largest int as an amount of time is 285 thousand years

	f(Time.minute - 1, "59.999s");//one millisecond less than the unit
	f(Time.year - 1, "11m 30d 10h 29m 59.999s");

	test.done();
}

exports.testSayTimeRemaining = function(test) {

	function f(t, s) {
		test.ok(sayTimeRemaining(t) == s);
	}

	// "0s" to "59s"
	f(0, "0s");
	f(23*Time.second, "23s");
	f(Time.minute - 1, "59s");

	// "1m 0s" to "9m 59s"
	f(Time.minute, "1m 0s");
	f(62*Time.second, "1m 2s");
	f(10*Time.minute - 1, "9m 59s");

	// "10m" to "59m"
	f(10*Time.minute, "10m");
	f(45*Time.minute, "45m");
	f(Time.hour - 1, "59m");

	// "1h 0m" to "9h 59m"
	f(Time.hour, "1h 0m");
	f(90*Time.minute, "1h 30m");
	f(10*Time.hour - 1, "9h 59m");

	// "10h" to "71h"
	f(10*Time.hour, "10h");
	f(48*Time.hour, "48h");
	f(3*Time.day - 1, "71h");

	// "3d" and up
	f(3*Time.day, "3d");
	f(14*Time.day, "14d");

	//coarse
	function coarse(t, s, sCoarse) {
		test.ok(sayTimeRemaining(t) == s);
		test.ok(sayTimeRemaining(t, true) == sCoarse);
	}
	coarse(1*Time.second, "1s", "1s");
	coarse(4*Time.second, "4s", "4s");
	coarse(6*Time.second, "6s", "5s");
	coarse(9*Time.second, "9s", "5s");
	coarse(11*Time.second, "11s", "10s");
	coarse(14*Time.second, "14s", "10s");

	test.done();
}

exports.testSayTimeRace = function(test) {

	function f(t, s) {
		test.ok(sayTimeRace(t) == s);
	}

	f(0, "0'00\"000");
	f(1, "0'00\"001");
	f(999, "0'00\"999");
	f(1000, "0'01\"000");

	f(5*Time.minute + 21*Time.second + 789, "5'21\"789");
	f(100*Time.minute, "100'00\"000");

	test.done();
}













//   ____        _       
//  |  _ \  __ _| |_ ___ 
//  | | | |/ _` | __/ _ \
//  | |_| | (_| | ||  __/
//  |____/ \__,_|\__\___|
//                       

var sayDate = requireMeasure.sayDate;
var sayDateAndTime = requireMeasure.sayDateAndTime;
var sayDayAndTime = requireMeasure.sayDayAndTime;

var optionCulture = requireMeasure.optionCulture;

exports.testSayDateDay = function(test) {

	function f(t, i, f, e) {

		optionCulture.set("i"); test.ok(sayDateAndTime(t) == i);
		optionCulture.set("f"); test.ok(sayDateAndTime(t) == f);
		optionCulture.set("e"); test.ok(sayDateAndTime(t) == e);
	}

	var t = 32*Time.year + 4*Time.month + 22*Time.day + 10*Time.hour + 35*Time.minute + 44*Time.second + 456;//32 years after 1970
	
	f(t,
		"2002 May 25 Sat 00:35 44·456",
		"2002 May 25 Sat 00:35 44,456",
		"2002 May 25 Sat 12:35a 44.456s");//midnight

	t += 2*Time.hour
	f(t,
		"2002 May 25 Sat 02:35 44·456",
		"2002 May 25 Sat 02:35 44,456",
		"2002 May 25 Sat 2:35a 44.456s");//am single digit

	t += 8*Time.hour
	f(t,
		"2002 May 25 Sat 10:35 44·456",
		"2002 May 25 Sat 10:35 44,456",
		"2002 May 25 Sat 10:35a 44.456s");//am double digit

	t += 2*Time.hour
	f(t,
		"2002 May 25 Sat 12:35 44·456",
		"2002 May 25 Sat 12:35 44,456",
		"2002 May 25 Sat 12:35p 44.456s");//noon

	t += 3*Time.hour
	f(t,
		"2002 May 25 Sat 15:35 44·456",
		"2002 May 25 Sat 15:35 44,456",
		"2002 May 25 Sat 3:35p 44.456s");//pm single digit

	t += 8*Time.hour
	f(t,
		"2002 May 25 Sat 23:35 44·456",
		"2002 May 25 Sat 23:35 44,456",
		"2002 May 25 Sat 11:35p 44.456s");//pm double digit

	t += 7*Time.month + 20*Time.second + 545;
	test.ok(sayDate(t)        == "2002 Dec 25 Wed 12:06a");
	test.ok(sayDateAndTime(t) == "2002 Dec 25 Wed 12:06a 05.001s");
	test.ok(sayDayAndTime(t)  ==             "Wed 12:06a 05.001s");

	test.done();
}































var Stripe = requireMeasure.Stripe;







/*

//    ____ _                 _                      _   ____  _               
//   / ___| |__  _   _ _ __ | | __   __ _ _ __   __| | |  _ \(_) ___  ___ ___ 
//  | |   | '_ \| | | | '_ \| |/ /  / _` | '_ \ / _` | | |_) | |/ _ \/ __/ _ \
//  | |___| | | | |_| | | | |   <  | (_| | | | | (_| | |  __/| |  __/ (_|  __/
//   \____|_| |_|\__,_|_| |_|_|\_\  \__,_|_| |_|\__,_| |_|   |_|\___|\___\___|
//                                                                            

var numberOfChunks = requireMeasure.numberOfChunks;
var numberOfPieces = requireMeasure.numberOfPieces;

var indexChunkToByte = requireMeasure.indexChunkToByte;
var indexPieceToChunk = requireMeasure.indexPieceToChunk;
var indexPieceToByte = requireMeasure.indexPieceToByte;

var stripeChunkToByte = requireMeasure.stripeChunkToByte;
var stripePieceToChunk = requireMeasure.stripePieceToChunk;
var stripePieceToByte = requireMeasure.stripePieceToByte;

exports.testChunkExample = function(test) {

	//just show how a 2.1mb file is split into 3 pieces with chunks inside


	var bytes = 2*Size.mb + 16*Size.kb + 1;

	var chunks = numberOfChunks(bytes);
	var pieces = numberOfPieces(bytes);

	test.ok(chunks == 130);
	test.ok(pieces == 3);

	//each chunk has X or X bytes
	//each piece has 43 or 44 chunks

	log(say(stripePieceToChunk(bytes, Stripe(0, 1))));//i0w43
	log(say(stripePieceToChunk(bytes, Stripe(1, 1))));//i43w43
	log(say(stripePieceToChunk(bytes, Stripe(2, 1))));//i86w44


	try {
		log(say(stripePieceToChunk(bytes, Stripe(3, 1))));//bounds
		test.fail();
	} catch (e) { test.ok(e == "bounds"); }










	test.done();
}

exports.testChunkOverflow = function(test) {

	//size is the largest file that won't overflow
	//max is the largest number javascript treats as an integer, 2^53

	//size * chunks = max
	//chunks = size/16kb
	//so: size = sqrt(max * 16kb) = 2^(67/2) = 11.3gb

	function attempt(bytes) {
		var chunks = numberOfChunks(bytes);
		var pieces = numberOfPieces(bytes);

		indexChunkToByte(bytes, chunks)
		indexPieceToChunk(bytes, pieces);
		indexPieceToByte(bytes, pieces);
	}

	attempt(11*Size.gb);
	try {
		attempt(12*Size.gb);
		test.fail();
	} catch (e) { test.ok(e == "overflow"); }

	test.done();
}

*/










