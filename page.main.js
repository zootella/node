//console.log("page main\\");
contain(function(expose) {

var Vue = required.vue;

//make something, then change it's message
expose.main("vue-update", function() {

	var page = new Vue({
		el: '#page',
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button v-on:click="method1">Change Message</button>
				</p>
				<p>{{ message }}</p>
			</div>
		`,
		data: {
			message: "starting message"
		},
		methods: {
			method1() {
				this.message = "updated message";
			}
		}
	});
});

//same thing, with a component
expose.main("vue-update-component", function() {

	Vue.component("component-a", {
		props: ["p"],
		template: `<div>This is a Component A with message "{{ p.message }}"</div>`
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
				<component-a v-bind:p="p1"></component-a>
				<component-a v-bind:p="p2"></component-a>
				<component-a v-bind:p="p2"></component-a>
			</div>
		`,
		data: {
			p1: {
				message: "starting message 1"
			},
			p2: {
				message: "starting message 2"
			}
		},
		methods: {
			method1() {
				this.p1.message = "updated message 1";
			},
			method2() {
				this.p2.message = "updated message 2";
			},
			method3() {
				this.p1.message = "another update for 1";
				this.p2.message = "another update for 2";
			},
		}
	});
});

//make something, then hide and show it
expose.main("vue-hide", function() {

	var page = new Vue({
		el: '#page',
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button v-on:click="method1">Show</button>
					<button v-on:click="method2">Hide</button>
				</p>
				<p v-if="myShow">Here is a paragraph of text</p>
			</div>
		`,
		data: {
			myShow: true
		},
		methods: {
			method1() {
				this.myShow = true;
			},
			method2() {
				this.myShow = false;
			}
		}
	});
});

expose.main("vue-hide-component", function() {

	Vue.component("component-a", {
		props: ["p"],
		template: `<div>This is a Component A with message "{{ p.message }}"</div>`
	});

	var page = new Vue({
		el: '#page',
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button v-on:click="method1">Show 1</button>
					<button v-on:click="method2">Show 2</button>
					<button v-on:click="method3">Hide 1</button>
					<button v-on:click="method4">Hide 2</button>
				</p>
				<component-a v-bind:p="p1" v-if="p1.myShow"></component-a>
				<component-a v-bind:p="p2" v-if="p2.myShow"></component-a>
				<component-a v-bind:p="p2" v-if="p2.myShow"></component-a>
			</div>
		`,
		data: {
			p1: {
				message: "starting message 1",
				myShow: true
			},
			p2: {
				message: "starting message 2",
				myShow: true
			}
		},
		methods: {
			method1() {
				this.p1.myShow = true;
			},
			method2() {
				this.p2.myShow = true;
			},
			method3() {
				this.p1.myShow = false;
			},
			method4() {
				this.p2.myShow = false;
			}
		}
	});
});

//make a list of things, then add some more, then remove some
expose.main("vue-grow", function() {

	var page = new Vue({
		el: '#page',
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button v-on:click="method1">Add 5</button>
					<button v-on:click="method2">Remove Start</button>
					<button v-on:click="method3">Remove Middle</button>
					<button v-on:click="method4">Remove End</button>
				</p>
				<component-a v-for="p in myList" v-bind:key="p.id" v-bind:p="p"></component-a>
			</div>
		`,
		data: {
			myList: []
		},
		methods: {
			method1() {
				for (var i = 0; i < 5; i++) this.myList.push(makeComponent("hello there"));
			},
			method2() {
				this.myList.splice(0, 1);
			},
			method3() {
				this.myList.splice(this.myList.length / 2, 1);
			},
			method4() {
				this.myList.splice(this.myList.length - 1, 1);
			}
		}
	});

	Vue.component("component-a", {
		props: ["p"],
		template: `<div>This is a Component A with id "{{ p.id }}", timestamp "{{ p.made }}", and message "{{ p.message }}"</div>`
	});

	function makeComponent(message) {
		var p = {};
		p.id = makeUnique();
		p.made = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s";
		p.message = message;
		return p;
	}
});

//make a container of some other things
expose.main("vue-contain", function() {

	Vue.component("my-container", {
		props: ["p"],
		template: `
			<div style="border: 1px solid #ccc; padding: 8px; background: #eee; margin: 4px;">
			Container with message "{{ p.message }}"
				<component-a v-bind:p="p.p2" v-if="p.p2.myShow"></component-a>
			</div>
		`
	});

	Vue.component("component-a", {
		props: ["p"],
		template: `
			<div style="border: 1px solid #ccc; padding: 8px; background: #eee; margin: 4px;">
			This is a Component A with message "{{ p.message }}"
			</div>
		`
	});

	var page = new Vue({
		el: '#page',
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button v-on:click="method1">Show Container</button>
					<button v-on:click="method2">Show Contents</button>
					<button v-on:click="method3">Hide Container</button>
					<button v-on:click="method4">Hide Contents</button>
				</p>
				<my-container v-bind:p="p1" v-if="p1.myShow"></my-container>
			</div>
		`,
		data: {
			p1: {
				message: "default container message",
				myShow: true,
				p2: {
					message: "default component message",
					myShow: true
				}
			},
		},
		methods: {
			method1() {
				this.p1.myShow = true;
			},
			method2() {
				this.p1.p2.myShow = true;
			},
			method3() {
				this.p1.myShow = false;
			},
			method4() {
				this.p1.p2.myShow = false;
			}
		}
	});


});


/*

instead of this.thing, do page.thing


this is going really well
next, do this:
-combine them, have containers in containers, lists in containers, components in components
-play around with scope, have them keep their own records, affect them from afar
-make the counter, clock, and timer
-make hasher

is v-if showing and hiding, or building and destroying the dom? you want the one that just hides. what's the other one called?


instead of arrays, can you use


instead of matching up idn555 numbers with program-specific ids, you can also always do this
call makeUnique once to get the prefix
then have as many as you want idn555-yourUniqueId
this is a really good idea


figure out button and text area
available and ghosted
event on edit
get and set text
make a little sample that shows how to do those things






*/



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
				<p>{{ p.message }}</p>
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
				<stick-item v-bind:p="stickItem"></stick-item>
			</div>
		`,
		data: {
			logItems: [],
			stickItem: {message: "starting stick message", id: makeUnique()}
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



/*
make some examples where you show how to do
-one thing
-a list of things
and then
-things that appear and hide
-container things
-that have contents that appear and hide, and grow and shrink




*/

expose.main("snip1", function(a, b, c) {
	log("hello from snip1, which got #, #, and #".fill(a, b, c));
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