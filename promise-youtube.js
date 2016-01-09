



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
















