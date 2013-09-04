




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






























