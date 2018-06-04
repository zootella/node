








/*
vue
try out tabs, and see if they keep the scroll position

how will you keep the view separate from the data down below?
for instance, imagining running the whole engine headless, because instead of a user here clicking a page, the same commands are arriving from a remote control

you probably should never show 10k items, and instead have pagination and an instant filter style search box when that happens
for a small list, render all the elements, and use show to hide the ones off page or filtered away
but a big list might exist only in couch. there, you'll render just the elements on the page that match the filter
*/

/*
stress test spin with hundreds of clocks
figure out if vue is already using requestAnimationFrame
*/

/*
instead of matching up idn7 numbers with data-specific ids, you can instead do this
call idn() once for a list of items to get the prefix
then add unique data-specific suffixes, like a file hash
*/

/*
do more with button
normal/hot/pressed/set

try out checkbox and radio control

try out image, actually
*/

/*
in vue, some of the ideas from your own earlier design might make sense
what if you designed it so that everything is a Thing
and a Thing always has a unique id
and a template
and a div where a list of subthings can grow (or if this thing doesn't need subthings, then just leave it blank)
so there's only one kind of thing
and then here's where you start to wrap and simplify vue, i guess
*/

/*
so how would you ship the hasher to a friend?
do you use webpack to turn all your code and all the node_modules into a single huge file?
figure this out, it's the non-hacker build

maybe this is it
https://github.com/electron-userland
https://github.com/electron-userland/electron-webpack
https://github.com/electron-userland/electron-webpack-quick-start
*/

/*
you don't have to solve the 500 clocks slow down the page problem right now
you do need to make sure that showing quick status doesn't slow down a single clock, or a single hash
*/

/*
style for mac
*/
	appendHead(`
		<style type="text/css">
			div, p {
				margin: 8px 0 8px 0;
			}
			button {
				background-color: #ddd;
				border: 1px solid #aaa;
				font-size: 14px;
				cursor: pointer;
			}
			button:hover {
				border: 1px solid #888;
			}
			input[type = text] {
				font-size: 14px;
				width: 300px;
			}
			.box {
				border: 1px solid #ccc;
				padding: 8px;
				background: #eee;
				margin: 4px;
			}
		</style>
	`).appendTo("head");

/*
you've got node and electron, now
you've got library and tests and mains
you don't have an application
and you don't have the application's data, either a big javascript object or a collection of documents in CouchDB or something

is 'var win' local in expose main electron-main good enough? probably also loadCopy that onto global to really pin it
no, attach it to a program object that load already put on global
*/

/*
try index.html?serialized js object of parameters so you don't have to transfer global arguments over ipc

do real ipc with node core module and bluebird
rather than all the synchronous electron cheats

look at the ipc stuff you did a year ago
update that with bluebird
*/

/*
wait, does electron have child and modal windows now?
https://github.com/electron/electron/blob/master/docs/api/browser-window.md
try that out

const {BrowserWindow} = require('electron')
let top = new BrowserWindow()
let child = new BrowserWindow({parent: top})
child.show()
top.show()

how many processes is that?
*/











