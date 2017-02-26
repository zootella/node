







//show the demo where you think you can catch the exceptions, but it doesn't work because they're in separate functions

//watch leading promise youtube videos and pull in the best demos









/*

show different things you can do in a then function
return a value, and that value gets passed to the next function
return a promise, and it gets passed to the next function, after the promise has resolved





write a blog entry, then make a video where you talk through it with sandro, then post that to youtube, and link them to each other
best of both worlds, learning from video versus learning from text




loose wordpress, make it text files and then a script that builds it into html, and then have css
fancy features to add to code blocks
syntax highlighting
single click to copy, have a warning that you'll learn more by typing it in
single click to run on some site that runs javascript right in the browser, there are several

best of all, have this feature
just like the screenshots on getbot.com
click forward and back with little boxes that have arrows and highlight different parts of the code
this way, you can really point the user around the code as you go, this does this first, then resolves to this, and so on

make your own blog site just for code like that

instead of making the user click back or next, also have a little text box they can set the focus in, and then use the left and right arrow keys


*/

















//also search youtube for bluebird js videos
//and look for videos on es6 generators and es7 await



/*
https://www.youtube.com/watch?v=obaSQBBWZLk
Are you bad, good, better or best with Async JS? JS Tutorial: Callbacks, Promises, Generators
LearnCode.academy

plunkr is cool

talk about hte pyramid of doom, a bad shape in javascript
and having to handle errors each step of the way

flatten the pyramid, have a single error handling function for all of them
we're able to reuse our handleerror function

important things about promises
the thing the then function returns gets passed to the next function in the chain, and
if you return a promise, it won't happen until that promise is resolved

the error functions chain on down, so all we have to do is have a single error function at the end

and then show generators at the end, with Promise.coroutine(function*(){ and yield
*/


/*
https://www.youtube.com/watch?v=QO07THdLWQo
Javascript Generators - THEY CHANGE EVERYTHING - ES6 Generators Harmony Generators
LearnCode.academy


*/



/*
https://www.youtube.com/watch?v=oa2clhsYIDY
Promises in Javascript
Nodevember
2014nov21

history
1 blocking
2 threads
3 nonblocking, the good future

js is good at this because it has closures and function literals
single threaded
event loop
callbacks
so it's a natural for great nonblocking design

salable, better for the computer and the developer

an early tool was async.js

>states
pending
or settled, which is:
fulfilled, with a value, or
rejected, with a reason
once settled, it's immutable
*/

/*
//create a new promise
new Promise(resolveFunction, rejectFunction)
//async access to value or reason
Promise.then(value, error)
//wait for several promises
Promise.all([promise, ...])
//wait for first promise
Promise.race([promise, ...])
//at the end
promise.catch(error)

/*
.then promises to always get called in the next tick of the event loop


*/

/*
var email = getUser(name)
.then(function(user) {
	return user.email;
}).catch(function (error) {
	log(error);
	throw new BadUserName();
})
//successful, email is a promise, which is resolved, and has the value of user.email
//to see it, do
email.then(console.log);//calls console.log(user.email)

//bookmark at 20:50


Promise.all//do a bunch of stuff all at the same time, tell me when it's all done

Promise.race//this is how you'd build a timeout







//https://www.youtube.com/watch?v=g90irqWEqd8













/*

https://github.com/Reactive-Extensions/RxJS

"The Reactive Extensions for JavaScript (RxJS) is a set of libraries for composing asynchronous and event-based programs using observable sequences and fluent query operators that many of you already know by Array#extras in JavaScript. Using RxJS, developers represent asynchronous data streams with Observables, query asynchronous data streams using our many operators, and parameterize the concurrency in the asynchronous data streams using Schedulers. Simply put, RxJS = Observables + Operators + Schedulers."




*/





/*
after promises, continue the blog right onto streams
have parts where you just use node, then node and your own library
and build thatinto a book, promises and streams
*/





/*
https://www.youtube.com/watch?v=obaSQBBWZLk

plunkr

*/








/*

https://nodejs.org/api/child_process.html
"For scripting purposes you may find the synchronous counterparts more convenient."
the docs *admit* that the bad synchronous way is easier
what if it didn't have to be like that
what if the better, correct way was just as easy
let's see how we can do whatever it takes to make it so

as a developer, i'm tired of this kind of choice: between easy and correct
it's only software that makes up the rules of these computers, and we write software
we can write new rules



*/









//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
























/*
>notes

code node video
make the best youtube video about coding with promises and yield, ever
have the first part not include your code, the second part include your code
actually show not just sequential steps and exceptions, but function calls, conditionals, loops
take the viewer through the whole problem and solution, first all the calls are synchronous, then the api changes, now we want to use async, ok, code up the whole nested thing with the separate error handler, that's horrible, now say, how can we get our code to look more like it did at the start
and then show them how to do that, first with promises, and then with yield
all of this is separate from the more advanced stuff you need, like
>standard
do sequential steps
catch an exception
use subroutines, factor some steps into a separate function
use branches and loops, if and while
>enhanced
make sure everything got closed
close things that got opened after we stopped caring
cancel from outside
automatic and custom timeouts
progress from outside
*/















/*
>backup.exe

(demo)

the backup program
https://github.com/zootella/backup
https://github.com/zootella/backup/blob/master/task%20small.cpp
https://github.com/zootella/backup/blob/master/task%20big.cpp
https://github.com/zootella/backup/blob/master/job%20control.cpp

an earlier version didn't use threads, and the ui was frozen while running

sure, the os is multitasking, so running backup.exe then still wouldn't freeze your whole computer
and yet, this is as bad as curl, which everyone uses
*/

/*
>curl and the frozen shell

i once asked an experienced dev, 'isn't it bad that curl takes over the whole commadn line while it's downloading? what if the download is slow or gets stuck? even if it works, you still can't type while it's going on. you just have to wait and watch that awesome ascii arrow grow across your terminal.'
the response: when you're shelled into the datacenter, the connection is fast enough even big stuff comes across quick. if you're really bored, just open another shell window
*/
















/*
>demo

function demo() {}
*/

/*
>time

be able to make the examples run faster or slower
*/

/*
>wait

function wait() {}
*/

/*
>log
shows time as the clock tick

function log() {}
*/











/*
>remember to close

https://nodejs.org/api/fs.html
"If autoClose is false, then the file descriptor won't be closed, even if there's an error. It is your responsibility to close it and make sure there's no file descriptor leak."

in fact, it's always your responsibility to do this, even if it's just fs.open and everythign worked
but wait, with memory, i used to remember to call free() for every block i malloc()ed, but then we got garbage collection, and i could relax
if we can garbage collect memory, why can't we also do it to other you-must-remember-to-close resources, like file descriptors?

the answer is because the computer can't figure out when you and your program are done using the file
*/

/*
>Resource

so instead, here i've programed a system that lets the program tell you when you've forgotten to close everything
it's still your responsibility to close everything
once you think you've got everything closed, you ask the computer 'did i close everything?' and then it says 'yes, you got everything' or 'no, there's still some stuff open'

function Resource() {}
wraps something you need to close, so you can close it, and know if you've got any of these things still open before the program exits
*/









/*
>node gives us two sets of tools: easy and right

https://nodejs.org/api/fs.html
"In busy processes, the programmer is strongly encouraged to use the asynchronous versions of these calls. The synchronous versions will block the entire process until they complete--halting all connections."

node was born and bread to be 100% asynchronous
doing something synchronously will pause the entire process
and still, node offers synchronous versions of the apis
why?

because, they're easier to use
if you're just taking 5 minutes to code up a little script to run once on your desktop computer right now, it's ok if it blocks, and it's ok if it fails
the only user your script will ever have will be you, you'll be watching it run the whole time, and you'll delete the whole thing right after its single task is complete
for software like that, the synchronous functions are fine

but what if there were a way to make the asychronous functions just as easy to use?
it would be great if we could make a tool that combined the ease of use of the syncronous versions, wiht the durability and reliability of the asynchronous calls

and the test that tells us when we've accomplished this is: for the single-use, supervised, 5 minute, throwaway script, if we find ourselves picking the same tool we'd use for long term, third party use
*/






/*
>starting synchronous

*/

/*
>build the pyramid

*/

/*
>exceptions don't get caught

*/

/*
>flatten the pyramid with promises

*/

/*
>now exceptions get caught

*/







/*
>beyond sequential steps
that's nice, and 99% of the promise examples you'll find out there
but it was just sequential steps
how many times in your real programs do you have code like that?
real code combines sequential steps with
-conditionals, like if
-loops, like while
-subroutines
-and even sometimes, recursive functions
*/

/*
>conditionals, like if
before, with synchronous, and after, with promises

*/

/*
>loops, like while

*/

/*
>subroutines

*/

/*
>recursive functions

*/










//user promises in tests





























//how to make an object with a private member

function Car(year, model) {

}

//and then add the drive method, and checkOdometer
//and notice how you can't set the odometer back





//what is closure
//run through the double closure omg example


//explain the closure pattern
//how parenthesis are used for 3 things in javascript
//break it out into multiple lines



//get a clear text editor with cool mountains in the background, have a different background for each video
























