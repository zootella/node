console.log(`page2.js pid ${process.pid}
__dirname  ${__dirname}
__filename ${__filename}`);





/*
try to replace
<script type="text/javascript" src="node_modules/vue/dist/vue.js"></script>
into
var platformVue = require("vue");
but if it gives you any trouble, switch right back

build up your sample again
make log and stick
make text entry box and [Button]



*/



var Vue = require("vue/dist/vue.js");



console.log("type of vue: " + typeof Vue);


var page = new Vue({
	el: '#page',
	data: {
		title: 'this is the starting title',
		message: 'this is the starting message, edited again',
		fruits: []
	},
	methods: {
		method1() {
			/*
			this.fruits.push(makeFruit(5, "yellow", "banana"));
			this.fruits.push(makeFruit(12, "red", "apple"));
			this.fruits.push(makeFruit(3, "brown", "kiwi"));
			*/
		},
		method2() {
			/*
			this.fruits[1].quantity = 0;//second, this works
			*/
		},
		method3() {
			/*
			wayOutside();
			*/
		},
	}
});




/*
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


*/
