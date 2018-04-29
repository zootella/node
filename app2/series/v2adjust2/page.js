console.log(`v2adjust2 PAGE pid ${process.pid}, dirname ${__dirname}
got ${process.argv.length} arguments: ${process.argv}`);





/*

try to turn
<script type="text/javascript" src="node_modules/vue/dist/vue.js"></script>
into
platform.vue = require("vue");
and then build up your sample again, working piece by working piece

and then also get jquery in here, you might need it to change the window title or set some css or something

it doesn't matter if it's not standard if it works without errors


*/







console.log("type of vue: " + typeof Vue);

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




let a = "a";

var app = new Vue({
	el: '#app',
	data: {
		title: 'this is the starting title',
		message: 'this is the starting message',
		fruits: []
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

function wayOutside() {
	console.log("way outside");
	app.fruits[2].quantity = 100;//third, this works
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

// Make a unique identifier for a new element on the page, from "idn1" through "idn9000000000000000" and then "idnn1", quick and infinite
let unique_i, unique_s;
function makeUnique() {
	if (!unique_s) unique_s = "id"; // Starting prefix
	if (!unique_i || unique_i > 9000000000000000) { unique_s += "n"; unique_i = 1; } // It's over nine thousand! actually quadrillion
	return unique_s + unique_i++; // Increment number for next time
}



