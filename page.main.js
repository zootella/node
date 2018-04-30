//console.log("page main\\");
contain(function(expose) {


/*
how this currently works (you'll probably change it)

run by node:
node runs 'snip2'

run by electron:
electron main runs 'electron-main', which creates the browser window
electron renderer runs 'electron-renderer' and then 'snip2'
*/

expose.main("electron-main", function() {
	log("hi from electron-main");

	var app = required.electron.app;
	var win; // Keep a global reference to the window object so it's not garbage collected, which would close the window
	app.on("ready", function() { // Electron has finished starting and is ready to make windows
		win = new required.electron.BrowserWindow({width: 900, height: 1100}); // Create the browser window
		win.loadURL("file://" + __dirname + "/index.html"); // Load the page of the app
		win.webContents.openDevTools(); // Open the developer tools
		win.on("closed", function() { // The user closed the window
			win = null; // Discard our reference to the window object
		});
	});
	app.on("window-all-closed", function() { // All the windows are closed
		app.quit();
	});
});

expose.main("electron-renderer", function() {
	log("hi from electron-renderer");

	//TODO do this with vue instead
	/*
	var $ = required.jquery;
	$(document).ready(function() {
		$("body").html('<input type="button" value="Refresh" onClick="window.location.reload()"/>');
	});
	*/	
});


//you can define global vue components way early during load
//not sure if they can contain crazy custom tags inside, though
required.vue.component("container", {
	props: ["p"],
	template: `
		<div>
			This is a container with id {{ p.id }}.
		</div>
	`
});

expose.main("snip3", function(a, b, c) {
	log("hi from snip3");
	var Vue = required.vue;

	Vue.component('log-item', {
		props: ['p'],
		template: `
			<div>{{ p.message }}</div>
		`
	});

	Vue.component('stick-item', {
		props: ['p'],
		template: `
			<div>
				<p>this is a stick item, really there will only be one</p>
				<p>{{  }}</p>
			</div>
		`
	});

	var page = new Vue({
		el: '#page',
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button v-on:click="method1">Method 1</button>
					<button v-on:click="method2">Method 2</button>
					<button v-on:click="method3">Method 3</button>
				</p>
				<p>hello snip three, where we will make simple local log and stick</p>
				<log-item v-for="p in logItems" v-bind:key="p.id" v-bind:p="p"></log-item>
				<stick-item></stick-item>
			</div>
		`,
		data: {
			logItems: [],
			stickItem: {id: makeUnique()}
		},
		methods: {
			method1() {
				this.logItems.push(makeLogItem("log message one"));
			},
			method2() {

			},
			method3() {
			},
		}
	});

	function makeLogItem(message) {
		let o = {};
		o.id = makeUnique();
		o.message = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s " + message;
		return o;
	}



});




expose.main("snip2", function(a, b, c) {
	log("hi from snip2");
	log("hello snip #, #, and #".fill(a, b, c));
	var Vue = required.vue;

	Vue.component('fruit', {
		props: ['f'],
		template: `
			<div>
				{{ f.quantity }} {{ f.color }} {{ f.name }}(s)
				<button v-on:click="f.more">More</button>
				<button v-on:click="f.less">Less</button>
			</div>
		`
	});




	var page = new Vue({
		el: '#page',
		template: `
			<div>
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
			</div>
		`,
		data: {
			title: 'this is the starting title',
			message: 'this is the starting message',
			fruits: [],
			containers: []
		},
		methods: {
			method1() {
				this.fruits.push(makeFruit(5, "yellow", "banana"));
				this.fruits.push(makeFruit(12, "red", "apple"));
				this.fruits.push(makeFruit(3, "brown", "kiwi"));
			},
			method2() {
				this.fruits[1].quantity = 0;//second, this works
			},
			method3() {
				wayOutside();
			},
		}
	});


	page.containers = [
		{id: makeUnique()},
		{id: makeUnique()},
		{id: makeUnique()}
	];

	function wayOutside() {
		console.log("way outside");
		page.fruits[2].quantity = 100;//third, this works
	}

	function makeFruit(quantity, color, name) {
		let o = {};
		o.id = makeUnique();
		o.quantity = quantity;
		o.color = color;
		o.name = name;
		o.more = function() { o.quantity++; }//first, this works
		o.less = function() { o.quantity--; }
		return o;
	}

	
});










// Make a unique identifier for a new element on the page, from "idn1" through "idn9000000000000000" and then "idnn1", quick and infinite
var unique_i, unique_s;
function makeUnique() {
	if (!unique_s) unique_s = "id"; // Starting prefix
	if (!unique_i || unique_i > 9000000000000000) { unique_s += "n"; unique_i = 1; } // It's over nine thousand! actually quadrillion
	return unique_s + unique_i++; // Increment number for next time
}










/*
is 'var win' local in expose main electron-main good enough? probably also loadCopy that onto global to really pin it
no, attach it to a program object that load already put on global
yeah, the application object, time to start thinking about that

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
*/






});
//console.log("page main/");