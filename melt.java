


//   ____  _             
//  |  _ \(_)_ __   __ _ 
//  | | | | | '_ \ / _` |
//  | |_| | | | | | (_| |
//  |____/|_|_| |_|\__, |
//                 |___/ 

// The program's single Ding object requests a pulse every 200 milliseconds just in case nothing is happening

// Start our Ding that will pulse the program so timeouts get noticed
function dingStart() {
	if (timer == null) {
		timer = new Timer((int)Time.delay / 2, new MyActionListener()); // Check every half delay to catch nothing happening sooner
		timer.setRepeats(true);
		timer.start();
	}
}

// Stop our Ding so it won't pulse the program again
function dingStop() {
	if (timer != null) {
		timer.stop(); // Stop and discard timer, keeping it might prevent the program from closing
		timer = null; // Discard the timer object so a future call to start() can start things again
	}
}

// Our Timer set to repeat
var dingTimer;

// When the timer goes off, Java calls this method
private class MyActionListener extends AbstractAction {
	public void actionPerformed(ActionEvent a) {
		try {
			if (!timer) return; // Don't do anything if we're stopped
			
			// Pulse soon if we haven't pulsed in a while
			if (!start &&       // If the program isn't already pulsing or set to start, and
				monitor.ding()) // It's been longer than the delay since the last pulse finished
				soon();         // Have the program pulse soon to notice things that have timed out

		} catch (Throwable t) { Mistake.stop(t); } // Stop the program for an exception we didn't expect
	}
}

//   __  __             _ _             
//  |  \/  | ___  _ __ (_) |_ ___  _ __ 
//  | |\/| |/ _ \| '_ \| | __/ _ \| '__|
//  | |  | | (_) | | | | | || (_) | |   
//  |_|  |_|\___/|_| |_|_|\__\___/|_|   
//                                      

// The program's Pulse object has a Monitor to record efficiency and performance statistics
public class Monitor {
	
	// Count
	
	// How many pulses have happened
	private long countPulses;
	// How many pulses have gone over the time limit and quit early
	private long countHitLimit;
	
	// The number objects in the list
	private Average objectsPerList = new Average();
	// The number of loops in a pulse
	private Average loopsPerPulse = new Average();
	// How long pulses last in milliseconds
	private Average timePerPulse = new Average();
	
	// The speed at which pulses are happening right now
	private Speed pulseSpeed = new Speed(Time.second); // Keep the most recent 1 second of data
	// The the highest speed we measured
	private Maximum pulsesPerSecond = new Maximum();

	// The time when we last entered or left the pulse function
	private Now now = new Now();
	// How long the program has spent inside the pulse function, in milliseconds
	private long timeInside;
	// How long the program has spent outside the pulse function, in milliseconds
	private long timeOutside;
	
	// Count how many loops are in each pulse
	private long loop;

	// Event
	
	// true if it's been longer than the delay since the last pulse finished
	public boolean ding() {
		return now.expired(Time.delay);
	}
	
	// A pulse started
	public void start() {
		countPulses++;
		pulsesPerSecond.add(pulseSpeed.add(1, Time.second * Describe.thousandths)); // 1 event, get speed in events per second, to the thousandths
		timeOutside += now.age(); // Measure how long we were outside
		now = new Now();
		loop = 0;
	}
	
	// Record another loop in the current pulse
	public boolean loop() {
		loop++;
		if (now.expired(Time.delay / 2)) { countHitLimit++; return true; } // Quit early if we're over the time limit
		return false;
	}
	
	// The pulse ended, the list has n Close objects in it
	public void end(int size) {
		objectsPerList.add(size);
		loopsPerPulse.add(loop);
		long inside = now.age(); // Measure how long we were inside
		now = new Now();
		timeInside += inside;
		timePerPulse.add(inside);
	}
	
	// Describe

	// Compose text for the user about how efficiently the program is running
	public String describeEfficiency() {
		
		String mostObjectsPerList = Describe.commas(objectsPerList.maximum());
		String averageObjectsPerList = objectsPerList.toString();
		String nowObjectsPerList = Describe.commas(objectsPerList.recent());

		String mostLoopsPerPulse = Describe.commas(loopsPerPulse.maximum());
		String averageLoopsPerPulse = loopsPerPulse.toString();
		String nowLoopsPerPulse = Describe.commas(loopsPerPulse.recent()); //TODO does not work, you need an average of recent values, not a total in time
		
		String mostPulsesPerSecond = Describe.decimal(pulsesPerSecond.maximum(), 3);
		String averagePulsesPerSecond = Describe.divide(Time.second * countPulses, timeInside + timeOutside);
		String nowPulsesPerSecond = Describe.decimal(pulseSpeed.speed(Time.second * Describe.thousandths), 3);

		String mostTimePerPulse = Describe.commas(timePerPulse.maximum());
		String averageTimePerPulse = timePerPulse.toString();
		String nowTimePerPulse = Describe.commas(timePerPulse.recent());
		
		String pulsesHitTimeLimit = Describe.percent(countHitLimit, countPulses);
		String timeSpentPulsing = Describe.percent(timeInside, timeInside + timeOutside);
		
		StringBuffer s = new StringBuffer();
		s.append("pulse efficiency:\r\n");
		s.append("\r\n");
		s.append(Text.table(4,
			"most",              "average",              "now",              "",
			mostObjectsPerList,  averageObjectsPerList,  nowObjectsPerList,  "objects/list",
			mostLoopsPerPulse,   averageLoopsPerPulse,   nowLoopsPerPulse,   "loops/pulse",
			mostPulsesPerSecond, averagePulsesPerSecond, nowPulsesPerSecond, "pulses/second",
			mostTimePerPulse,    averageTimePerPulse,    nowTimePerPulse,    "ms/pulse"));
		s.append("\r\n");
		s.append(pulsesHitTimeLimit + " pulses hit time limit\r\n");
		s.append(timeSpentPulsing   + " ms time spent pulsing\r\n");
		return s.toString();
	}
}

//   ____        _          
//  |  _ \ _   _| |___  ___ 
//  | |_) | | | | / __|/ _ \
//  |  __/| |_| | \__ \  __/
//  |_|    \__,_|_|___/\___|
//                          

// Contents

// A timer that will cause a pulse to happen even if nothing else does
private final Ding ding = new Ding();

// Record efficiency and performance statistics
public final Monitor monitor = new Monitor();

//    ____ _                
//   / ___| | ___  ___  ___ 
//  | |   | |/ _ \/ __|/ _ \
//  | |___| | (_) \__ \  __/
//   \____|_|\___/|___/\___|
//                          

// Check

// Make sure this object isn't closed before doing something that would change it
public void confirmOpen() { if (objectClosed) throw new IllegalStateException(); }

// Make sure this object is closed, throw e if given, and make sure o exists
public void check(ProgramException e, Object o) {
	if (!objectClosed) throw new IllegalStateException();
	if (e != null) throw e;
	if (o == null) throw new NullPointerException();
}






























