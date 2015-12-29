











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






















