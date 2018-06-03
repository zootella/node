//console.log("page test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };//TODO












//make something, then change its message
expose.main("page-update", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["p"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="p.method1">Change Message</button>
				</p>
				<p>{{ p.message }}</p>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				message: "starting message",
				method1() {
					p.message = "updated message";
				}
			}
			return p;
		}
	});

	var page = pageTag.make();
});

//same thing, with a component
expose.main("page-update-component", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["p"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="p.m1">Method 1</button>
					<button @click="p.m2">Method 2</button>
					<button @click="p.m3">Method 3</button>
				</p>
				<itemTag :p="p.p1"></itemTag>
				<itemTag :p="p.p2"></itemTag>
				<itemTag :p="p.p2"></itemTag>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				p1: itemTag.make("starting message 1"),
				p2: itemTag.make("starting message 2"),
				m1() {
					p.p1.message = "updated message 1";
				},
				m2() {
					p.p2.message = "updated message 2";
				},
				m3() {
					p.p1.message = "another update for 1";
					p.p2.message = "another update for 2";
				}
			};
			return p;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["p"],
		template: `<div>This is an item with {{ p.id }} and message "{{ p.message }}"</div>`,
		make(startingMessage) {
			var p = {
				id: idn(),//TODO ids not unique, but also not used as ids on the page, so maybe that's ok
				message: startingMessage
			};
			return p;
		}
	});

	var page = pageTag.make();
});
/*
//TODO
ids are not unique here
but also, they're not used as ids on the page, so maybe that's ok
make an example where you render the same thing two places on the page, one model drives both, but they've got different ids so they can appear in a list
*/

//make something, then hide and show it
expose.main("page-show", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["p"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="p.m1">Show</button>
					<button @click="p.m2">Hide</button>
				</p>
				<p v-show="p.show">Here is a paragraph of text</p>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				show: true,
				m1() { p.show = true; },
				m2() { p.show = false; }
			};
			return p;
		}
	});

	var page = pageTag.make();
});

//same thing with a component
expose.main("page-show-component", function() {

	var aTag = tag("<aTag>", {
		properties: ["p"],
		template: `<div>This is a Component A with message "{{ p.message }}"</div>`,
		make() {
			var p = {
				id: idn(),
			};
			return p;
		}
	});

	var pageTag = tag("<pageTag>", {
		properties: ["p"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="p.method1">Show 1</button>
					<button @click="p.method2">Show 2</button>
					<button @click="p.method3">Hide 1</button>
					<button @click="p.method4">Hide 2</button>
				</p>
				<aTag :p="p.p1" v-show="p.p1.show"></aTag>
				<aTag :p="p.p2" v-show="p.p2.show"></aTag>
				<aTag :p="p.p2" v-show="p.p2.show"></aTag>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				p1: {
					message: "starting message 1",
					show: true
				},
				p2: {
					message: "starting message 2",
					show: true
				},
				method1() { p.p1.show = true;  },
				method2() { p.p2.show = true;  },
				method3() { p.p1.show = false; },
				method4() { p.p2.show = false; }
			};
			return p;
		}
	});

	var page = pageTag.make();
});

//make a list of things, then add some more, then remove some
expose.main("page-grow", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["p"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="p.m1">Add 5</button>
					<button @click="p.m2">Remove Start</button>
					<button @click="p.m3">Remove Middle</button>
					<button @click="p.m4">Remove End</button>
				</p>
				<itemTag v-for="(q, index) in p.a" :key="q.id" :p="q" :i="index"></itemTag>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				a: [],
				m1() { for (var i = 0; i < 5; i++) p.a.push(itemTag.make("hello")); },
				m2() { p.a.splice(0, 1); },
				m3() { p.a.splice(p.a.length / 2, 1); },
				m4() { p.a.splice(p.a.length - 1, 1); }
			};
			return p;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["p", "i"],
		template: `<div>index{{ i }}: This is an item with id "{{ p.id }}", timestamp "{{ p.made }}", and message "{{ p.message }}"</div>`,
		make(message) {
			var p = {
				id: idn(),
				made: sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s",
				message: message
			};
			return p;
		}
	});

	var page = pageTag.make();
});

//make a container that holds something else
expose.main("page-contain", function() {

	appendHead(`<style type="text/css"> .box { border: 1px solid #ccc; padding: 8px; background: #eee; margin: 4px; } </style>`);

	var pageTag = tag("<pageTag>", {
		properties: ["p"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="p.outside.click">{{ p.outside.button }}</button>
					<button @click="p.outside.inside.click">{{ p.outside.inside.button }}</button>
				</p>
				<outsideTag :p="p.outside" v-show="p.outside.show"></outsideTag>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				outside: outsideTag.make()
			};
			return p;
		}
	});

	var outsideTag = tag("<outsideTag>", {
		properties: ["p"],
		template: `
			<div class="box">
				Outside container with message "{{ p.message }}"
				<button @click="p.click">{{ p.button }}</button>
				<insideTag :p="p.inside" v-show="p.inside.show"></insideTag>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				message: "default outside message",
				show: true,
				button: "Hide Outside",
				click() {
					if (p.show) { p.show = false; p.button = "Show Outside"; }
					else        { p.show = true;  p.button = "Hide Outside"; }
				},
				inside: insideTag.make()
			};
			return p;
		}
	});

	var insideTag = tag("<insideTag>", {
		properties: ["p"],
		template: `
			<div class="box">
				Inside component with message "{{ p.message }}"
				<button @click="p.click">{{ p.button }}</button>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				message: "default inside message",
				show: true,
				button: "Hide Inside",
				click() {
					if (p.show) { p.show = false; p.button = "Show Inside"; }
					else        { p.show = true;  p.button = "Hide Inside"; }
				},
			};
			return p;
		}
	});

	var page = pageTag.make();
});

expose.main("page-place", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["p"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>

				<p>item0: always here</p>
				<itemTag :key="p.item0.id" :p="p.item0"></itemTag>

				<p><button @click="p.m1add">Add</button> <button @click="p.m1remove">Remove</button> item1: array that grows from empty and shrinks</p>
				<itemTag v-for="q in p.item1" :key="q.id" :p="q"></itemTag>

				<p><button @click="p.m2render">Render</button> <button @click="p.m2delete">Delete</button> item2: v-if to insert and remove from the dom</p>
				<itemTag v-if="p.item2.render" :key="p.item2.id" :p="p.item2"></itemTag>

				<p><button @click="p.m3show">Show</button> <button @click="p.m3hide">Hide</button> item3: v-show to hide </p>
				<itemTag v-show="p.item3.show" :key="p.item3.id" :p="p.item3"></itemTag>
			</div>
		`,
		make() {
			var p = {};
			p.id = idn();
			p.item0 = itemTag.make("hello zero");
			p.item1 = [];
			p.item2 = itemTag.make("hello 2");
			p.item3 = itemTag.make("hello three three three");

			p.m1add = function() { p.item1.push(itemTag.make("hello one")); };
			p.m1remove = function() { p.item1.splice(0, 1); };

			p.m2render = function() { p.item2.render = true; };
			p.m2delete = function() { p.item2.render = false; };

			p.m3show = function() { p.item3.show = true; };
			p.m3hide = function() { p.item3.show = false; };
			return p;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["p", "i"],
		template: `<div>This is an item with id "{{ p.id }}" and message "{{ p.message }}"</div>`,
		make(message) {
			return {
				id: idn(),
				render: true,
				show: true,
				message: message
			};
		}
	});

	var page = pageTag.make();
});

//how to use properties, index, event, and references
expose.main("page-pier", function() {

	appendHead(`
		<style type="text/css">
			p {
				margin: 0;
			}
			.box {
				border: 1px solid #ccc;
				padding: 2px;
				background: #eee;
				margin: 4px;
			}
		</style>
	`);

	var pageTag = tag("<pageTag>", {
		properties: ["p"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="p.m1">Add 5</button>
					<button @click="p.m2">Remove Start</button>
					<button @click="p.m3">Remove Middle</button>
					<button @click="p.m4">Remove End</button>
					<button @click="p.m5">Sort ▲</button>
					<button @click="p.m6">Sort ▼</button>
				</p>
				<itemTag v-for="(q, index) in p.a" :key="q.id" :p="q" :i="index"></itemTag>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				a: [],
				m1() { for (var i = 0; i < 5; i++) p.a.push(itemTag.make(p, "hello")); },
				m2() { p.a.splice(0, 1); },
				m3() { p.a.splice(p.a.length / 2, 1); },
				m4() { p.a.splice(p.a.length - 1, 1); },
				m5() { p.a.sort(function(a, b) { return a.count - b.count }); },
				m6() { p.a.sort(function(a, b) { return b.count - a.count }); }
			};
			return p;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["p", "i"],
		template: `
			<div class="box">
				index{{ i }},
				{{ p.id }},

				<button @click="p.remove(i)">Remove</button>,
				{{ p.made }} <button @click="p.update">Update</button>,
				{{ p.count }} <button @click="p.increment">Increment</button>,

				<input type="text" :value="p.inputCurrent" @input="p.onInput($event)" ref="inputReference"/>
				<button @click="p.onSet($refs)">Set</button>
				"{{ p.inputSet }}"
			</div>
		`,
		make(up, inputArgument) {
			var p = {
				id: idn(),
				up: up,

				remove(i) { up.a.splice(i, 1); },

				made: sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s",
				update() { p.made = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s";},

				count: 0,
				increment() { p.count++; },

				inputCurrent: inputArgument,
				inputSet: "",
				onInput(e) {//called when the user types
					var currentText = e.target.value;
					p.inputCurrent = currentText;//manually update the model
				},
				onSet(r) {
					var currentText = r.inputReference.value;
					p.inputSet = currentText;
				}
			};
			return p;
		}
	});

	var page = pageTag.make();
});

//automatic and traditional forms
expose.main("page-form", function() {

	appendHead(`
		<style type="text/css">
			p {
				margin: 0;
			}
			.box {
				border: 1px solid #ccc;
				padding: 2px;
				background: #eee;
				margin: 4px;
			}
		</style>
	`);

	var pageTag = tag("<pageTag>", {
		properties: ["p"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="p.m1(2)">Add Some</button>
					<button @click="p.m2">Remove Start</button>
					<button @click="p.m3">Remove Middle</button>
					<button @click="p.m4">Remove End</button>
					<button @click="p.m5">Sort ▲</button>
					<button @click="p.m6">Sort ▼</button>
				</p>
				<itemTag v-for="(q, index) in p.a" :key="q.id" :p="q" :i="index"></itemTag>
			</div>
		`,
		make() {
			var p = {
				id: idn(),
				a: [],
				m1(n) { for (var i = 0; i < n; i++) p.a.push(itemTag.make(p, "start 1", "start 2", "start 3")); },
				m2() { p.a.splice(0, 1); },
				m3() { p.a.splice(p.a.length / 2, 1); },
				m4() { p.a.splice(p.a.length - 1, 1); },
				m5() { p.a.sort(function(a, b) { return a.count - b.count }); },
				m6() { p.a.sort(function(a, b) { return b.count - a.count }); }
			};
			return p;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["p", "i"],
		template: `
			<div class="box">
				<p>
					index{{ i }},
					{{ p.id }},
					<button @click="p.remove(i)">Remove</button>,
					{{ p.made }} <button @click="p.update">Update</button>,
					{{ p.count }} <button @click="p.increment">Increment</button>
				</p>

				<p>input1
				<input type="text" v-model="p.input1model" @input="p.input1onInput" placeholder="placeholder 1"/>
				"{{ p.input1model }}"</p>

				<p>input2
				<input type="text" :value="p.input2model" @input="p.input2onInput($event)" placeholder="placeholder 2"/>
				"{{ p.input2model }}"</p>

				<p>input3
				<input type="text" :value="p.input3model" @input="p.input3onInput($event)" placeholder="placeholder 3" ref="input3reference"/>
				"{{ p.input3model }}"
				<button @click="p.input3onClick($refs)">Set</button>
				"{{ p.input3set }}"</p>
			</div>
		`,
		make(up, input1start, input2start, input3start) {
			var p = {
				id: idn(),
				up: up,
				remove(i) { up.a.splice(i, 1); },
				made: sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s",
				update() { p.made = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s";},
				count: 0,
				increment() { p.count++; },

				//input1: automatic model, stays in sync by itself, and we can still get called when it changes
				input1model: input1start,
				input1onInput() {
					var s = p.input1model;
					log(`input 1 current text "#"`.fill(s));
				},

				//input2: same thing but hooked up manually, now we get the current text from the event
				input2model: input2start,
				input2onInput(e) {//called when the user types
					var s = e.target.value;
					p.input2model = s;//manually update the model
				},

				//input3: more like a traditional form with a Set button
				input3model: input3start,
				input3set: "",
				input3onInput(e) {//called when the user types
					var s = e.target.value;
					p.input3model = s;//manually update the model
				},
				input3onClick(r) {
					var s = r.input3reference.value;
					p.input3set = s;
				}
			};
			return p;
		}
	});

	var page = pageTag.make();
});









/*

>page-reach
make another one that demonstrates reaching into and out of things
see if you can do all this without going global on the page object, for instance
do you ever need page.rootVueInstance?

>page-tree
make the simple, everything, grows wide and deep omniwidget
as an example more than something to use
*/






















































































});
//console.log("page test/");