


//name your evented stream improvements 'flow'






//platforms to try
//1 just the regular node way
//2 with your modifications here
//3 third party node modules like async
//4 iced coffeescript


//all the awesomeness of node streams, with these additional features
//Meter - metering on every valve input and output, see total distance, speed, histograms, max and min
//timeout - if something gets stuck for 4s, cancel and shut rather than just waiting forever
//Range - requested ranges that may be a certain distance then done, or may be infinity


//and these more ideas
//progress even if nothing's happening, see how long it's been since the last progress
//a unified way of reporting progress, no matter what's being transferred underneath
//try twice then give up for good, have that be the default for a task


//these are the rules for an asynchronous task
//1 after 4 seconds, it cancels the task
//2 it tries twice before giving up
//you can query it whenever for statistics on how fast its going, or how long its been waiting
//the code that does this is abstract and easily pluggable into anything


//maybe don't throw exceptions at all, maybe exceptions dont work well with async
//just catch them and keep them and read them as values




















