


/*
here's what your going to make with vue
1 log and stick for exploringnode examples
2 the visual repl and subapps in the running process for backup/everpipe/pchan
3 the full ui for backup/everpipe/pchan
*/







/*
>load steps
you've got it so that the main doesn't run until $ says ready
but you still need to get it to that it builds and shows the whole page, and then makes the window visible
goals are to be snap-quick to not need a progress bar, but also not blink the screen which looks like a website not a client app
if its not snap-quick, show electron rendering the password field or even just the background color, and then load everything after that

right now both electron main and electron renderer load all your library code, *.core.js
you'd like to keep everything in one electron renderer process
if you accomplish that, and electron main doesn't do anything
have electron main run a script without all those extra libraries and library code
*/





/*
what's the only thing the electron main process can do?
if it's prompt system dialogs like file open, file save, maybe don't use those and then never use it

it's ok to leave the command line behind
if you want a command line interface to something later on, you'll code up a blessed ui for it

maybe make the tabs at the top early on
mains can become about:name in one of those tabs
and from there you can start coding more sophisticated mains, run them at the same time

alternatively to tabs, code up the command line
$ is a prompt to start something
but then it grows into html which continues to be interactive
you can have as many as you want, all on top of one another
*/





/*
your page system really only needs to do 3 things
-never slow down the core waiting for a return from a call into the gui
-update the gui 60fps
-measure how long that takes, and reduce to 10fps or even 1fps if there's so much on the page updating it takes a really long time

additionally, hopefully vue is already doing all this for you, but find out and prove it somehow
-don't double-change the page when the data underneath gets repeatedly set to the same current value
-don't waste time trying to change the page faster than window.requestAnimationFrame
-don't spend any time updating something that's hidden, or (harder) scrolled away (but what if it changes height to come partially into view)
*/











