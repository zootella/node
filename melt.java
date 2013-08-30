
//    ____ _                _     _     _   
//   / ___| | ___  ___  ___| |   (_)___| |_ 
//  | |   | |/ _ \/ __|/ _ \ |   | / __| __|
//  | |___| | (_) \__ \  __/ |___| \__ \ |_ 
//   \____|_|\___/|___/\___|_____|_|___/\__|
//                                          

// The program just made a new object that extends Close, add it to the program's list
public synchronized void add(Close c) { // If a Task thread creates a new Close object, it will enter this method
	list.add(c);
}

//   ____  _             
//  |  _ \(_)_ __   __ _ 
//  | | | | | '_ \ / _` |
//  | |_| | | | | | (_| |
//  |____/|_|_| |_|\__, |
//                 |___/ 

// The program's single Ding object requests a pulse every 200 milliseconds just in case nothing is happening
public class Ding {
	
	// Start our Ding that will pulse the program so timeouts get noticed
	public synchronized void start() {
		if (timer == null) {
			timer = new Timer((int)Time.delay / 2, new MyActionListener()); // Check every half delay to catch nothing happening sooner
			timer.setRepeats(true);
			timer.start();
		}
	}
	
	// Stop our Ding so it won't pulse the program again
	public synchronized void stop() {
		if (timer != null) {
			timer.stop(); // Stop and discard timer, keeping it might prevent the program from closing
			timer = null; // Discard the timer object so a future call to start() can start things again
		}
	}
	
	// Our Timer set to repeat
	private volatile Timer timer;

	// When the timer goes off, Java calls this method
	private class MyActionListener extends AbstractAction {
		public void actionPerformed(ActionEvent a) {
			try {
				if (timer == null) return; // Don't do anything if we're stopped
				
				Pulse.pulse.ding(); // Pulse soon if we haven't pulsed in a while

			} catch (Throwable t) { Mistake.stop(t); } // Stop the program for an exception we didn't expect
		}
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

//   ____             _ 
//  |  _ \ ___   ___ | |
//  | |_) / _ \ / _ \| |
//  |  __/ (_) | (_) | |
//  |_|   \___/ \___/|_|
//                      

// A thread pool to run tasks
public class Pool {
	
	// Access the thread pool to submit a new task
	public synchronized ExecutorService get() {
		if (service == null)
			service = Executors.newCachedThreadPool(); // Good choice for a large number of quick asynchronous tasks
		return service;
	}
	private ExecutorService service;
	
	// When the program or test is done, stop the thread pool so the process can exit
	public synchronized void stop() {
		if (service != null) {
			service.shutdownNow(); // Stop the threads in the pool so the program can exit
			service = null;        // Discard the service so a future call to get() can start things again
		}
	}
}

//   ____        _          
//  |  _ \ _   _| |___  ___ 
//  | |_) | | | | / __|/ _ \
//  |  __/| |_| | \__ \  __/
//  |_|    \__,_|_|___/\___|
//                          

// The program's single pulse object pulses all the open objects in the program to move things forward
public class Pulse {
	
	// Instance
	
	// The program's single Pulse object
	public static final Pulse pulse = new Pulse();
	
	// Contents

	// A thread pool to run tasks
	public final Pool pool = new Pool();
	
	// A timer that will cause a pulse to happen even if nothing else does
	private final Ding ding = new Ding();

	// Record efficiency and performance statistics
	public final Monitor monitor = new Monitor();
	
	// Stop
	
	// When the program or test is done, make sure you closed every object, and stop things so the process can exit
	public void stop() {
		
		// Stop things so the process will be able to exit
		pool.stop(); // Shut down the thread pool
		ding.stop(); // Stop and discard the timer

		// Make sure the program closed every object before trying to exit
		clear();                // Remove closed objects from the list
		int size = list.size(); // See how many are left
		if (size != 0) {        // We should have closed them all, but didn't
		
			StringBuffer s = new StringBuffer(); // Compose and return text about the objects still open by mistake
			s.append(size + " objects open:\n");
			for (int i = 0; i < size; i++) {
				Close c = list.get(i);
				if (Close.open(c)) { // Skip closed objects
					s.append(c.toString() + "\n");
				}
			}
			
			Mistake.close(s.toString()); // Log the list of objects and exit the process
		}
		
		// Log performance and efficiency statistics
		Log.log(monitor.describeEfficiency());
	}

	// Start
	
	// true when we've set Java to call run(), and it hasn't yet
	private boolean start;
	// true when an object has requested another pass up the pulse list
	private boolean again;
	
	// Pulse soon if we haven't pulsed in a while
	public void ding() {
		if (!start &&       // If the program isn't already pulsing or set to start, and
			monitor.ding()) // It's been longer than the delay since the last pulse finished
			soon();         // Have the program pulse soon to notice things that have timed out
	}

	// An object in the program has changed or finished.
	// Pulse soon so the object that made it can notice and take the next step forward.
	// It's safe to call this from the event thread or a Task thread, and it will return quickly.
	public void soon() {
		if (SwingUtilities.isEventDispatchThread()) {
			soonDo();
		} else {
			SwingUtilities.invokeLater(new Runnable() { // Have the normal Swing thread call this run() method
				public void run() {
					try {
						soonDo();
					} catch (Throwable t) { Mistake.stop(t); } // Stop the program for an exception we didn't expect
				}
			});
		}
	}
	private void soonDo() {

		// Start a pulse if one isn't already happening
		if (!start) { // No need to start a new pulse if we're doing one now already
			start = true;
			SwingUtilities.invokeLater(new MyRunnable()); // Have Java call run() below separately and soon
		}

		// Have the pulse loop up the list again
		again = true;
	}

	// Soon after soon() above calls SwingUtilities.invokeLater(), Java calls this run() method
	private class MyRunnable implements Runnable {
		public void run() {
			try {
				pulseAll();
			} catch (Throwable t) { Mistake.stop(t); } // Stop the program for an exception we didn't expect
		}
	}

	// Pulse
	
	// Pulse all the open objects in the program until none request another pulse soon
	private void pulseAll() {
		monitor.start();
		
		// Pulse up the list in many passes until no object requests another pulse soon
		while (again) {
			again = false; // Don't loop again unless an object we pulse below calls soon() above
			if (monitor.loop()) break; // Quit early this pulse goes over the time limit
			
			// Pulse up the list in a single pass
			for (int i = list.size() - 1; i >= 0; i--) { // Loop backwards to pulse contained objects before the older objects that made them
				Close c = list.get(i);
				if (Close.open(c)) { // Skip closed objects
					try {
						c.pulse(); // Pulse the object so it notices things that have finished and moves to the next step
					} catch (Throwable t) { Mistake.stop(t); } // Stop the program for an exception we didn't expect
				}
			}
		}
		
		// In a single pass after that, pulse up the list to have objects compose information for the user
		if (screen.enough()) { // Only update the screen 5 times a second
			for (int i = list.size() - 1; i >= 0; i--) {
				Close c = list.get(i);
				if (Close.open(c)) { // Skip closed objects
					try {
						c.pulseScreen(); // Pulse the object to have it compose text for the user to show current information
					} catch (Throwable t) { Mistake.stop(t); } // Stop the program for an exception we didn't expect
				}
			}
		}
		
		clear(); // Remove closed objects from the list all at once at the end
		monitor.end(list.size());
		start = false; // Allow the next call to soon to start a new pulse
	}
	
	// Make sure we don't update the screen too frequently
	private Ago screen = new Ago(Time.delay);
	
	// List

	// Add a new object that extends Close to the program's list of open objects
	public void add(Close c) {
		list.add(c); // It's safe to add to the end even during a pulse because we loop by index number
		ding.start(); // Start the ding if it's not started already
	}

	// Remove objects that got closed from our list
	private void clear() {
		for (int i = list.size() - 1; i >= 0; i--) { // Loop backwards so we can remove things along the way
			Close c = list.get(i);
			if (Close.done(c)) // Only remove closed objects
				list.remove(i);
		}
	}
}

// Remove the object at index i from the list
public synchronized void remove(int i) {
	try {
		list.remove(i);
	} catch (IndexOutOfBoundsException e) { Mistake.ignore(e); } // Only the event thread calls size() and remove(), so shouldn't happen
}






