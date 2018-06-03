


/*






oh, it does work
well that was silly

>next steps
write the idnn99 generator
a list of templates that grows and shrinks
updating the parts of those templates
nesting two levels deep

make two kinds of things
a counter, that just has a one more button
a timer, that has start/stop/rest buttons
and then put those in two lists, with add and delete to make a new one
see how they can affect themselves
as well as communicate down to a layer that's separate from the data stuck to the page
maybe also have tabs at the top that hide and restore whole sets of things

once you have that, make stick and log with buttons and text fields
this is all easy, you just have to do it



uid9999zzzz




make a vue example that has a working button and input box
read guides and follow videos, but keep in mind that:
the only thing you need to make is stick and log and button in html



<script src="https://unpkg.com/vue"></script>

<div id="app">
	<p><button v-on:click="method1">My Button</button></p>
	<p><input type="text" v-on:input="method2"></p>
	
	
	<p>{{ title }}</p>
</div>


new Vue({
	el: '#app',
	data: {
		title: 'this is the starting message'
	},
	methods: {
		method1() {
			this.title = 'you clicked the button';
		},
		method2() {
			this.title = `you changed the text to "${ "TODO" }"`;	
		}
	}
});





$event.target.value
$event is a variable that vue makes for you in the scope of your method
target is the html element
value is specific to the dom, but in the case of an input box, is the text currently in the box















single list of things with buttons

fruit has
-name
-color
-quantity

there's a list of fruits

17 yellow bananas [more] [less]

global buttons at the top can add more, remove some, change colors, and change quantities







ok, you can get button presses out and get new data in
next might be getting this into electron and node
and just writing log and stick with it
you can worry about doing a full real ui later, you can tell from the docs that it's possible and maybe not even that hard, tabs and everything




here's what your going to make with vue
1 log and stick for exploringnode examples
2 the visual repl and subapps in the running process for backup/everpipe/pchan
3 the full ui for backup/everpipe/pchan




*/









/*


new design:
dont run main or snip on blank, you always have to spell out exactly what you want to run
let every electron main bring a set of three functions:
ask for 'main7' and node just runs 'main7'
but electron main runs 'main7-electron-main', and then electron renderer runs 'main7-electron-renderer' and 'main7'
and if you put those suffixes on them, it happens for you


*/





/*

<input type="button" value="Refresh" onClick="window.location.reload()"/>
<p>now let's try some components</p>
<p>
	<button v-on:click="method1">Method 1</button>
	<button v-on:click="method2">Method 2</button>
	<button v-on:click="method3">Method 3</button>
</p>
<p>{{ message }}</p>
<fruit v-for="f in fruits" v-bind:key="f.id" v-bind:f="f"></fruit>
<container v-for="p in containers" v-bind:key="p.id" v-bind:p="p"></container>






/*

ok, vue seems to be working right now
next, actually build something

stick and log
right now, not attached to or interacting with the real stick and log

<log-list>
	<log-item></log-item>
	<log-item></log-item>
	<log-item></log-item>
	<log-item></log-item>
	<log-item></log-item>
</log list>
<stick-item></stick-item>







*/



expose.main("electron-renderer", function() {
	log("hi from electron-renderer");

	var $ = required.jquery;
	$(document).ready(function() {
		$("body").html('<input type="button" value="Refresh" onClick="window.location.reload()"/>');
	});
});
/*
in the days of jquery, you had document.ready
do you need to do something like that for vue?
*/



/*
simpler idea:
$ node load.js snip7, runs snip7
$ electron load.js snip7, electron main runs electron-main, then electron renderer runs snip7
the earlier idea here was that everything was a main
and that mains were coded to run in node or electron
but in node, only one main can run at a time, and now in electron, you want to get many of them going at once
so probably abandon node entirely, and just switch to electron
*/





/*
what's the only thing the electron main process can do?
if it's prompt system dialogs like file open, file save, maybe don't use those and then never use it

completely forget about the commadn line, completely leave it behind
if you want a command line interface to something later on, you'll code up a blessed ui for it

maybe make the tabs at the top early on
mains can become about:name in one of those tabs
and from there you can start coding more sophisticated mains, run them at the same time

alternatively to tabs, code up the command line
$ is a prompt to start something
but then it grows into html which continues to be interactive
you can have as many as you want, all on top of one another

ok once you've got all that running, command line arguments dont matter

code up the clock, the timer, and the hasher


*/


/*
your system really only needs to do 3 things
-never show down the core waiting for a return from a call into the gui
-update the gui 60fps
-measure how long that takes, and reduce to 10fps or even 1fps if there's so much on the page updating it takes a really long time
*/

































































