
















//speed loop demos
//generalize it to a function followed by an event
//make it an interactive demo that shows current speed, and stop and start
//function, event, process.nextTick, setTimer, setImmediate

//make an object which finishes on the first pulse, and hook that into a loop to see how many you can do in 4s, this is a test of how fast soon is, really





//measure the speed of two distances travelled
if (demo("speed")) {

	var s = Speed(10*Time.second);
	s.distance(50*Size.mb);//50mb right now
	log("went 50mb");

	setTimeout(function() {
		s.distance(50*Size.mb);//50mb a second later
		log("went another 50mb a second later");
		log(saySpeed(s.speed(Time.second)));//that's 100mb/s
	}, 1000);
}

//see how fast node can loop with events, three different ways
if (demo("set-timeout")) { eventSpeed("timeout"); }//~60 events/s
if (demo("set-immediate")) { eventSpeed("immediate"); }//~100k events/s
if (demo("process-next-tick")) { eventSpeed("tick"); }//node warning to use setImmediate instead

function eventSpeed(method) {

	var speed = Speed(Time.second);
	var start = now();
	var count = 0;
	var limit = 4*Time.second;

	log("this will take", limit, "ms, using", method, "method");
	once();

	function once() {
		if (!start.expired(limit)) {//still within the time limit

			//count another loop
			count++;
			speed.count();

			//run this again in a new event right away
			if      (method == "timeout")   setTimeout(once, 0);
			else if (method == "immediate") setImmediate(once);
			else if (method == "tick")      process.nextTick(once);
			else throw "argument";

		} else {//time's up

			//say how fast we went
			log("counted", count, "loops in", start.age(), "ms");
			log("measured speed of", speed.speed(Time.second), "loops/second");
		}
	}
}


//use sayunits to make these better
//change log to not insert spaces, sometimes you don't want them, and it should be the same as say()


//this is cool, but write on that shows speed in real time, and lets you pause, unpause, and restart it
//and make it general so that it can call whatever function you give it
//figure out how to do that in an async case, probably with event emitter or something


















