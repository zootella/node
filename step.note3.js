
var Q = require("q");
require("./load").library();

















//   __  __      _   _               _   _ 
//  |  \/  | ___| |_| |__   ___   __| | / |
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` | | |
//  | |  | |  __/ |_| | | | (_) | (_| | | |
//  |_|  |_|\___|\__|_| |_|\___/ \__,_| |_|
//                                         

if (demo("method100t"))  { demoMethod1Multiple("df","t", "df"); }
if (demo("method100n"))  { demoMethod1Multiple("df","n", "df"); }
if (demo("method100dd")) { demoMethod1Multiple("df","dd","df"); }
if (demo("method100di")) { demoMethod1Multiple("df","di","df"); }
if (demo("method100df")) { demoMethod1Multiple("df","df","df"); }
if (demo("method100ds")) { demoMethod1Multiple("df","ds","df"); }
if (demo("method100fd")) { demoMethod1Multiple("df","fd","df"); }
if (demo("method100fi")) { demoMethod1Multiple("df","fi","df"); }
if (demo("method100ff")) { demoMethod1Multiple("df","ff","df"); }
if (demo("method100fs")) { demoMethod1Multiple("df","fs","df"); }

function demoMethod1Multiple(behavior1, behavior2, behavior3) {
	log("start");
	wait(SimulateTime.multiple, function () { closeCheck(); });//wait for everything to finish

	var a1, a2, a3;//vars to point to answer objects, or null before we get them

	f0();//call the first function to start the chain
	function f0() {
		try {
			simulateMethod1(behavior1, f1);
		} catch (e) { log("catch '#'".fill(e)); close(a1, a2, a3); }
	}
	function f1(error, answer) {
		try {
			if (error) {
				log("step1fail '#'".fill(error));
				close(answer, a1, a2, a3);
			} else {
				log("step1done '#'".fill(answer));
				a1 = answer;
				simulateMethod1(behavior2, f2);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3); }
	}
	function f2(error, answer) {
		try {
			if (error) {
				log("step2fail '#'".fill(error));
				close(answer, a1, a2, a3);
			} else {
				log("step2done '#'".fill(answer));
				a2 = answer;
				simulateMethod1(behavior3, f3);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3); }
	}
	function f3(error, answer) {
		try {
			if (error) {
				log("step3fail '#'".fill(error));
				close(answer, a1, a2, a3);
			} else {
				log("step3done '#'".fill(answer));
				a3 = answer;
				close(answer, a1, a2, a3);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3); }
	}

	log("return");
}

/*
method 1 multiple results

t:   [start, return, step1done, catch,                check closed    ]
n:   [start, return, step1done,                       check not closed]
dd:  [start, return, step1done, step2done, step3done, check closed    ]
di:  [start, return, step1done, step2done, step3done, check closed    ]
df:  [start, return, step1done, step2done, step3done, check closed    ]
ds:  [start, return, step1done, step2done, step3done, check closed    ]
fd:  [start, return, step1done, step2fail,            check closed    ]
fi:  [start, return, step1done, step2fail,            check closed    ]
ff:  [start, return, step1done, step2fail,            check closed    ]
fs:  [start, return, step1done, step2fail,            check closed    ]
*/


















//   __  __      _   _               _   ____  
//  |  \/  | ___| |_| |__   ___   __| | |___ \ 
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` |   __) |
//  | |  | |  __/ |_| | | | (_) | (_| |  / __/ 
//  |_|  |_|\___|\__|_| |_|\___/ \__,_| |_____|
//                                             

if (demo("method200t"))  { demoMethod2Multiple("df","t", "df"); }
if (demo("method200n"))  { demoMethod2Multiple("df","n", "df"); }
if (demo("method200dd")) { demoMethod2Multiple("df","dd","df"); }
if (demo("method200di")) { demoMethod2Multiple("df","di","df"); }
if (demo("method200df")) { demoMethod2Multiple("df","df","df"); }
if (demo("method200ds")) { demoMethod2Multiple("df","ds","df"); }
if (demo("method200fd")) { demoMethod2Multiple("df","fd","df"); }
if (demo("method200fi")) { demoMethod2Multiple("df","fi","df"); }
if (demo("method200ff")) { demoMethod2Multiple("df","ff","df"); }
if (demo("method200fs")) { demoMethod2Multiple("df","fs","df"); }

function demoMethod2Multiple(behavior1, behavior2, behavior3) {
	log("start");
	wait(SimulateTime.multiple, function () { closeCheck(); });//wait for everything to finish

	var a1, a2, a3;//vars to point to answer objects, or null before we get them

	var promise = simulateMethod2(behavior1)
	.then(function (answer) {
		log("step1done '#'".fill(answer));
		a1 = answer;

		return simulateMethod2(behavior2);
	}).then(function (answer) {
		log("step2done '#'".fill(answer));
		a2 = answer;

		return simulateMethod2(behavior3);
	}).then(function (answer) {
		log("step3done '#'".fill(answer));
		a3 = answer;

	}).fail(function (answer) {
		log("fail '#'".fill(answer));

	}).fin(function () {
		log("fin");
		close(a1, a2, a3);

	});

	log("return");
	return promise;
}

/*
method 2 multiple results

t:   [start, return, step1done, fail,                 fin, check closed    ]
n:   [start, return, step1done,                            check not closed]
dd:  [start, return, step1done, step2done, step3done, fin, check closed    ]
di:  [start, return, step1done, step2done, step3done, fin, check closed    ]
df:  [start, return, step1done, step2done, step3done, fin, check closed    ]
ds:  [start, return, step1done, step2done, step3done, fin, check closed    ]
fd:  [start, return, step1done, fail,                 fin, check not closed]
fi:  [start, return, step1done, fail,                 fin, check not closed]
ff:  [start, return, step1done, fail,                 fin, check not closed]
fs:  [start, return, step1done, fail,                 fin, check not closed]

what needs improvement:
if a callback takes forever, fin never gets called, none of the functions do, actually
if a callback returns an error and a resource, there isn't a way to get and close the resource
*/





































