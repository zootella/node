//console.log("page test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };//TODO












//make something, then change its message
expose.main("page-update", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="m.method1">Change Message</button>
				</p>
				<p>{{ m.message }}</p>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				message: "starting message",
				method1() {
					m.message = "updated message";
				}
			}
			return m;
		}
	});

	var page = pageTag.make();
});

//same thing, with a component
expose.main("page-update-component", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="m.method1">Method 1</button>
					<button @click="m.method2">Method 2</button>
					<button @click="m.method3">Method 3</button>
				</p>
				<itemTag :m="m.model1"></itemTag>
				<itemTag :m="m.model2"></itemTag>
				<itemTag :m="m.model2"></itemTag>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				model1: itemTag.make("starting message 1"),
				model2: itemTag.make("starting message 2"),
				method1() {
					m.model1.message = "updated message 1";
				},
				method2() {
					m.model2.message = "updated message 2";
				},
				method3() {
					m.model1.message = "another update for 1";
					m.model2.message = "another update for 2";
				}
			};
			return m;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["m"],
		template: `<div>This is an item with {{ m.id }} and message "{{ m.message }}"</div>`,
		make(startingMessage) {
			var m = {
				id: idn(),//TODO ids not unique, but also not used as ids on the page, so maybe that's ok
				message: startingMessage
			};
			return m;
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
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="m.method1">Show</button>
					<button @click="m.method2">Hide</button>
				</p>
				<p v-show="m.show">Here is a paragraph of text</p>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				show: true,
				method1() { m.show = true; },
				method2() { m.show = false; }
			};
			return m;
		}
	});

	var page = pageTag.make();
});

//same thing with a component
expose.main("page-show-component", function() {

	var aTag = tag("<aTag>", {
		properties: ["m"],
		template: `<div>This is a Component A with message "{{ m.message }}"</div>`,
		make() {
			var m = {
				id: idn(),
			};
			return m;
		}
	});

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="m.method1">Show 1</button>
					<button @click="m.method2">Show 2</button>
					<button @click="m.method3">Hide 1</button>
					<button @click="m.method4">Hide 2</button>
				</p>
				<aTag :m="m.model1" v-show="m.model1.show"></aTag>
				<aTag :m="m.model2" v-show="m.model2.show"></aTag>
				<aTag :m="m.model2" v-show="m.model2.show"></aTag>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				model1: {
					message: "starting message 1",
					show: true
				},
				model2: {
					message: "starting message 2",
					show: true
				},
				method1() { m.model1.show = true;  },
				method2() { m.model2.show = true;  },
				method3() { m.model1.show = false; },
				method4() { m.model2.show = false; }
			};
			return m;
		}
	});

	var page = pageTag.make();
});

//make a list of things, then add some more, then remove some
expose.main("page-grow", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="m.method1">Add 5</button>
					<button @click="m.method2">Remove Start</button>
					<button @click="m.method3">Remove Middle</button>
					<button @click="m.method4">Remove End</button>
				</p>
				<itemTag v-for="(n, index) in m.a" :key="n.id" :m="n" :i="index"></itemTag>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				a: [],
				method1() { for (var i = 0; i < 5; i++) m.a.push(itemTag.make("hello")); },
				method2() { m.a.splice(0, 1); },
				method3() { m.a.splice(m.a.length / 2, 1); },
				method4() { m.a.splice(m.a.length - 1, 1); }
			};
			return m;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["m", "i"],
		template: `<div>index{{ i }}: This is an item with id "{{ m.id }}", timestamp "{{ m.made }}", and message "{{ m.message }}"</div>`,
		make(message) {
			var m = {
				id: idn(),
				made: sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s",
				message: message
			};
			return m;
		}
	});

	var page = pageTag.make();
});

//make a container that holds something else
expose.main("page-contain", function() {

	appendHead(`<style type="text/css"> .box { border: 1px solid #ccc; padding: 8px; background: #eee; margin: 4px; } </style>`);

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="m.outside.click">{{ m.outside.button }}</button>
					<button @click="m.outside.inside.click">{{ m.outside.inside.button }}</button>
				</p>
				<outsideTag :m="m.outside" v-show="m.outside.show"></outsideTag>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				outside: outsideTag.make()
			};
			return m;
		}
	});

	var outsideTag = tag("<outsideTag>", {
		properties: ["m"],
		template: `
			<div class="box">
				Outside container with message "{{ m.message }}"
				<button @click="m.click">{{ m.button }}</button>
				<insideTag :m="m.inside" v-show="m.inside.show"></insideTag>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				message: "default outside message",
				show: true,
				button: "Hide Outside",
				click() {
					if (m.show) { m.show = false; m.button = "Show Outside"; }
					else        { m.show = true;  m.button = "Hide Outside"; }
				},
				inside: insideTag.make()
			};
			return m;
		}
	});

	var insideTag = tag("<insideTag>", {
		properties: ["m"],
		template: `
			<div class="box">
				Inside component with message "{{ m.message }}"
				<button @click="m.click">{{ m.button }}</button>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				message: "default inside message",
				show: true,
				button: "Hide Inside",
				click() {
					if (m.show) { m.show = false; m.button = "Show Inside"; }
					else        { m.show = true;  m.button = "Hide Inside"; }
				},
			};
			return m;
		}
	});

	var page = pageTag.make();
});

expose.main("page-place", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>

				<p>item0: always here</p>
				<itemTag :key="m.item0.id" :m="m.item0"></itemTag>

				<p><button @click="m.m1add">Add</button> <button @click="m.m1remove">Remove</button> item1: array that grows from empty and shrinks</p>
				<itemTag v-for="n in m.item1" :key="n.id" :m="n"></itemTag>

				<p><button @click="m.m2render">Render</button> <button @click="m.m2delete">Delete</button> item2: v-if to insert and remove from the dom</p>
				<itemTag v-if="m.item2.render" :key="m.item2.id" :m="m.item2"></itemTag>

				<p><button @click="m.m3show">Show</button> <button @click="m.m3hide">Hide</button> item3: v-show to hide </p>
				<itemTag v-show="m.item3.show" :key="m.item3.id" :m="m.item3"></itemTag>
			</div>
		`,
		make() {
			var m = {};
			m.id = idn();
			m.item0 = itemTag.make("hello zero");
			m.item1 = [];
			m.item2 = itemTag.make("hello 2");
			m.item3 = itemTag.make("hello three three three");

			m.m1add = function() { m.item1.push(itemTag.make("hello one")); };
			m.m1remove = function() { m.item1.splice(0, 1); };

			m.m2render = function() { m.item2.render = true; };
			m.m2delete = function() { m.item2.render = false; };

			m.m3show = function() { m.item3.show = true; };
			m.m3hide = function() { m.item3.show = false; };
			return m;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["m", "i"],
		template: `<div>This is an item with id "{{ m.id }}" and message "{{ m.message }}"</div>`,
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

//how to use model, index, event, and references
expose.main("page-mier", function() {

	appendHead(`
		<style type="text/css">
			p { margin: 0; }
			.box { border: 1px solid #ccc; padding: 2px; background: #eee; margin: 4px; }
		</style>
	`);

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="m.method1">Add 5</button>
					<button @click="m.method2">Remove Start</button>
					<button @click="m.method3">Remove Middle</button>
					<button @click="m.method4">Remove End</button>
					<button @click="m.method5">Sort ▲</button>
					<button @click="m.method6">Sort ▼</button>
				</p>
				<itemTag v-for="(n, index) in m.a" :key="n.id" :m="n" :i="index"></itemTag>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				a: [],
				method1() { for (var i = 0; i < 5; i++) m.a.push(itemTag.make(m, "hello")); },
				method2() { m.a.splice(0, 1); },
				method3() { m.a.splice(m.a.length / 2, 1); },
				method4() { m.a.splice(m.a.length - 1, 1); },
				method5() { m.a.sort(function(a, b) { return a.count - b.count }); },
				method6() { m.a.sort(function(a, b) { return b.count - a.count }); }
			};
			return m;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["m", "i"],
		template: `
			<div class="box">
				index{{ i }},
				{{ m.id }},

				<button @click="m.remove(i)">Remove</button>,
				{{ m.made }} <button @click="m.update">Update</button>,
				{{ m.count }} <button @click="m.increment">Increment</button>,

				<input type="text" :value="m.inputCurrent" @input="m.onInput($event)" ref="inputReference"/>
				<button @click="m.onSet($refs)">Set</button>
				"{{ m.inputSet }}"
			</div>
		`,
		make(up, inputArgument) {
			var m = {
				id: idn(),
				up: up,

				remove(i) { m.up.a.splice(i, 1); },

				made: sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s",
				update() { m.made = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s";},

				count: 0,
				increment() { m.count++; },

				inputCurrent: inputArgument,
				inputSet: "",
				onInput(e) {//called when the user types
					var currentText = e.target.value;
					m.inputCurrent = currentText;//manually update the model
				},
				onSet(r) {
					var currentText = r.inputReference.value;
					m.inputSet = currentText;
				}
			};
			return m;
		}
	});

	var page = pageTag.make();
});

//automatic and traditional forms
expose.main("page-form", function() {

	appendHead(`
		<style type="text/css">
			p { margin: 0; }
			.box { border: 1px solid #ccc; padding: 2px; background: #eee; margin: 4px; }
		</style>
	`);

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="m.method1(2)">Add Some</button>
					<button @click="m.method2">Remove Start</button>
					<button @click="m.method3">Remove Middle</button>
					<button @click="m.method4">Remove End</button>
					<button @click="m.method5">Sort ▲</button>
					<button @click="m.method6">Sort ▼</button>
				</p>
				<itemTag v-for="(n, index) in m.a" :key="n.id" :m="n" :i="index"></itemTag>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				a: [],
				method1(n) { for (var i = 0; i < n; i++) m.a.push(itemTag.make(m, "start 1", "start 2", "start 3")); },
				method2() { m.a.splice(0, 1); },
				method3() { m.a.splice(m.a.length / 2, 1); },
				method4() { m.a.splice(m.a.length - 1, 1); },
				method5() { m.a.sort(function(a, b) { return a.count - b.count }); },
				method6() { m.a.sort(function(a, b) { return b.count - a.count }); }
			};
			return m;
		}
	});

	var itemTag = tag("<itemTag>", {
		properties: ["m", "i"],
		template: `
			<div class="box">
				<p>
					index{{ i }},
					{{ m.id }},
					<button @click="m.remove(i)">Remove</button>,
					{{ m.made }} <button @click="m.update">Update</button>,
					{{ m.count }} <button @click="m.increment">Increment</button>
				</p>

				<p>input1
				<input type="text" v-model="m.input1model" @input="m.input1onInput" placeholder="placeholder 1"/>
				"{{ m.input1model }}"</p>

				<p>input2
				<input type="text" :value="m.input2model" @input="m.input2onInput($event)" placeholder="placeholder 2"/>
				"{{ m.input2model }}"</p>

				<p>input3
				<input type="text" :value="m.input3model" @input="m.input3onInput($event)" placeholder="placeholder 3" ref="input3reference"/>
				"{{ m.input3model }}"
				<button @click="m.input3onClick($refs)">Set</button>
				"{{ m.input3set }}"</p>
			</div>
		`,
		make(up, input1start, input2start, input3start) {
			var m = {
				id: idn(),
				up: up,
				remove(i) { m.up.a.splice(i, 1); },
				made: sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s",
				update() { m.made = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s";},
				count: 0,
				increment() { m.count++; },

				//input1: automatic model, stays in sync by itself, and we can still get called when it changes
				input1model: input1start,
				input1onInput() {
					var s = m.input1model;
					log(`input 1 current text "#"`.fill(s));
				},

				//input2: same thing but hooked up manually, now we get the current text from the event
				input2model: input2start,
				input2onInput(e) {//called when the user types
					var s = e.target.value;
					m.input2model = s;//manually update the model
				},

				//input3: more like a traditional form with a Set button
				input3model: input3start,
				input3set: "",
				input3onInput(e) {//called when the user types
					var s = e.target.value;
					m.input3model = s;//manually update the model
				},
				input3onClick(r) {
					var s = r.input3reference.value;
					m.input3set = s;
				}
			};
			return m;
		}
	});

	var page = pageTag.make();
});












//spinners
expose.main("page-spin", function() {

	appendHead(`
		<style type="text/css">
			p { margin: 0; }
			.box { border: 1px solid #ccc; padding: 2px; background: #eee; margin: 4px; }
		</style>
	`);

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>New
					<button @click="m.same">Same</button>
					<button @click="m.clock">Look</button>
					<button @click="m.watch">Spin</button>
					<button @click="m.timer">Frame</button>
				</p>
				<sameTag  v-for="(n, index) in m.stamps"  :key="n.id" :m="n" :i="index"></sameTag>
				<lookTag  v-for="(n, index) in m.clocks"  :key="n.id" :m="n" :i="index"></lookTag>
				<spinTag  v-for="(n, index) in m.watches" :key="n.id" :m="n" :i="index"></spinTag>
				<frameTag  v-for="(n, index) in m.timers"  :key="n.id" :m="n" :i="index"></frameTag>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				same:  [], same()  { m.stamps.push(stampTag.make(m));   },
				clocks:  [], clock()  { m.clocks.push(clockTag.make(m));   },
				watches: [], watch()  { m.watches.push(watchTag.make(m));  },
				timers:  [], timer()  { m.timers.push(timerTag.make(m));   },
				hashers: [], hasher() { m.hashers.push(hasherTag.make(m)); }
				/*
				same spin0 - setImmediate counts to the same total as fast as it can, tells Vue every time
				look spin1 - setImmediate counts up as fast as it can, click to show the current total
				spin spin2 - setImmediate counts up as fast as it can, tells Vue every time
				frame spin3 - setImmediate counts up as fast as it can, tells Vue every requestAnimationFrame

				have a text field where you say how many


				and have buttons to make 500 of them, and to delete them all
				*/
			};
			return m;
		}
	});

	var stampTag = tag("<stampTag>", {
		properties: ["m", "i"],
		template: `
			<div class="box">
				index{{ i }}, {{ m.id }} <button @click="m.remove(i)">Remove</button>
				stamp {{ m.made }} <button @click="m.update">Update</button>
			</div>
		`,
		make(up) {
			var m = {
				id: idn(), up: up, remove(i) { m.up.stamps.splice(i, 1); },
				made: "",
				update() { m.made = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s";}
			};
			m.update();
			return m;
		}
	});

	var clockTag = tag("<clockTag>", {
		properties: ["m", "i"],
		template: `
			<div class="box">
				index{{ i }}, {{ m.id }} <button @click="m.remove(i)">Remove</button>
				clock {{ m.face }}
			</div>
		`,
		make(up) {
			var m = {
				id: idn(), up: up, remove(i) { m.up.clocks.splice(i, 1); },
				face: "",
				update() { m.face = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s";}
			};
			m.update();
			return m;
		}
	});

	var page = pageTag.make();
});


//clocks and timers
expose.main("page-clock", function() {

	appendHead(`
		<style type="text/css">
			p { margin: 0; }
			.box { border: 1px solid #ccc; padding: 2px; background: #eee; margin: 4px; }
		</style>
	`);

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>New
					<button @click="m.stamp">Stamp</button>
					<button @click="m.clock">Clock</button>
					<button @click="m.watch">Stopwatch</button>
					<button @click="m.timer">Timer</button>
					<button @click="m.hasher">Hasher</button>
				</p>
				<stampTag  v-for="(n, index) in m.stamps"  :key="n.id" :m="n" :i="index"></stampTag>
				<clockTag  v-for="(n, index) in m.clocks"  :key="n.id" :m="n" :i="index"></clockTag>
				<watchTag  v-for="(n, index) in m.watches" :key="n.id" :m="n" :i="index"></watchTag>
				<timerTag  v-for="(n, index) in m.timers"  :key="n.id" :m="n" :i="index"></timerTag>
				<hasherTag v-for="(n, index) in m.hashers" :key="n.id" :m="n" :i="index"></hasherTag>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				stamps:  [], stamp()  { m.stamps.push(stampTag.make(m));   },
				clocks:  [], clock()  { m.clocks.push(clockTag.make(m));   },
				watches: [], watch()  { m.watches.push(watchTag.make(m));  },
				timers:  [], timer()  { m.timers.push(timerTag.make(m));   },
				hashers: [], hasher() { m.hashers.push(hasherTag.make(m)); }
				/*
				spin1 - setImmediate counts up as fast as it can, click to show the current total
				spin2 - setImmediate counts up as fast as it can, tells Vue every time
				spin3 - setImmediate counts up as fast as it can, tells Vue every requestAnimationFrame
				*/
			};
			return m;
		}
	});

	var stampTag = tag("<stampTag>", {
		properties: ["m", "i"],
		template: `
			<div class="box">
				index{{ i }}, {{ m.id }} <button @click="m.remove(i)">Remove</button>
				stamp {{ m.made }} <button @click="m.update">Update</button>
			</div>
		`,
		make(up) {
			var m = {
				id: idn(), up: up, remove(i) { m.up.stamps.splice(i, 1); },
				made: "",
				update() { m.made = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s";}
			};
			m.update();
			return m;
		}
	});

	var clockTag = tag("<clockTag>", {
		properties: ["m", "i"],
		template: `
			<div class="box">
				index{{ i }}, {{ m.id }} <button @click="m.remove(i)">Remove</button>
				clock {{ m.face }}
			</div>
		`,
		make(up) {
			var m = {
				id: idn(), up: up, remove(i) { m.up.clocks.splice(i, 1); },
				face: "",
				update() { m.face = sayDateTemplate(now().time, "dddHH12:MMaSS.TTT") + "s";}
			};
			m.update();
			return m;
		}
	});

	var page = pageTag.make();
});


/*
			// Vue setImmediate, update every animation frame
			function spin17() {
				var count = 0;
				var start = Date.now();
				f();
				g();
				function f() {
					count++;
					if (Date.now() < start + 1000) {
						setImmediate(f);
					}
				}
				function g() {
					page.result17 = count;
					if (Date.now() < start + 1000) {
						window.requestAnimationFrame(g);
					}
				}
			}


			when the clock is destroyed, how do you keep code from still hitting window.requestAnimationFrame?
			first, does it?


			get page4 in here, actually



			also do one where it updates to the same result over and over again, stress testing vue's output differ




12. Vue synchronous loop, update once 17300621 frozen
13. Vue synchronous loop, update every time 2466684 frozen
14. Vue setImmediate, update once 94588 fluid
15. Vue setImmediate, update every time 16996 fluid
16. Vue window.requestAnimationFrame, update every time 62 fluid
17. Vue setImmediate, update every animation frame 87273 fluid

ok, so 87 is a lot better than 16, so you want to use every animation frame
and a disaster would be even after a page element is destroyed, code is still updating it
and an optimizatino would be if something is not being shown because it's not on the up tab, it doesn't get shown
and another optimization would be, if the result is the same, it doesn't get updated
and some of these vue might be doing, and others they're not




>compare these three
Vue setImmediate, update once (new one)
Vue setImmediate, update every time 16879
Vue setImmediate, update every animation frame 86676






*/















/*
>page-reach
make another one that demonstrates reaching into and out of things
see if you can do all this without going global on the page object, for instance
do you ever need page.rootVueInstance?

>page-tree
make the simple, everything, grows wide and deep omniwidget
as an example more than something to use
*/




/*
now you can easily make the clock, stopwatch, and timer

and log and stick

and make the hasher
and see if it's significantly slower to no-progress hashing in a few lines of node on the command line
and see if getAnimationFrame makes it faster, yeah, those are the only 3 things you need to race
*/





/*
three ideas that might be this side of the horizon, now

a single component that becomes everything
by containing a list of 0+ sub-things

$ [text box]
where you can enter a page
like a main but electron only, and you can have more than one running at a time
and then go back and convert some mains into pages this way

a hyper-shorthand like [ text ] [Button]
that becomes vue that becomes html

log and stick for the web
could you run existing command line mains on the page with very little modification?
*/





/*
make dent(``) so that you can use that for outline, and so that html snippets in the chrome dev tools look nicer
make it strict, too, throwing code if you give it something weird
have it require commas, not spaces, etc
*/







/*
simpler design for load and page
leave the command line
$ electron load.js
pops the window, which looks like
$
type a dap there, which might take over the whole page
or just render a div and give you another $
this is a cool idea

but you still need
$ node load.js main name arg1
for node, you also realize
*/









































































});
//console.log("page test/");