
var $ = require("jquery");

require("../../load").load("base", function() { return this; });

log("page pid #, dirname #".fill(process.pid, __dirname));


$(document).ready(function() {

	var t = Template(`
		<input type="button" value="Refresh" onClick="window.location.reload()"/>
		<div id="page">
			<div id="stack"/>
		</div>
	`);
	$("body").html(t.merge());

	var d = Dialog();
	d.log("log in a dialog");
	d.stick("stick in a dialog with a [button] perhaps");
	/*
	var d2 = Dialog();
	d1.stick("stick1");
	d2.stick("stick1");
	d1.log("hi1a");
	d2.log("hi2a");
	d1.log("hi1b");
	d1.stick("stick1 edited");

	var div1 = MakeDiv();
	div1.element.text("add some text");
	var div2 = MakeButton("Start", function(e) {
		log("clicked: ", inspect(e));
		div2.enable(false);
	});

	$("#stack").append(div1.element);
	$("#stack").append(div2.element);
	*/

});



var _id = 0;
function id() {
	_id++;
	return "id"+_id;
}



function Dialog() {
	var o = {};
	o.id = id();

	var t = Template(`
		<div class="dialog" id="{{id}}">
			<div class="command">$</div>
			<div class="log"></div>
			<div class="stick"></div>
		</div>
	`);
	$("#stack").append(t.merge({id: o.id}));

	o.log = function(s) {
		$("#"+o.id).find(".log").append($("<p>").text(s));//no controls allowed in log
	}
	o.stick = function(s) {
		$("#"+o.id).find(".stick").html(makeControls(s));
	}
	return o;
}
//ok, that's great
//next, add parsing [] in stick into a working button

//given text like "hello [button] you", compose stuff for the new stick that will work on the page
function makeControls(s) {
	var t, h;

	var p = s.parse("[", "]");
	if (p.found) {
		t = Template(`
			<p>{{before}}<input type="button" id="{{id}}" value="{{name}}"/>{{after}}</p>
		`);
		h = t.merge({
			before: p.before,
			id:     id(),
			name:   p.middle,
			after:  p.after
		});
	} else {
		t = Template(`
			<p>{{all}}</p>
		`);
		h = t.merge({
			all:s
		});
	}
	return h;
}
//ok, now have clicking the button log that it was clicked
//then figure out the best way to have two buttons, [a] and [b], and log knows which one was clicked





function MakeDiv() {
	var o = {}
	o.id = id();
	var t = Template(`
		<div id="{{id}}"/>
	`);
	o.html = t.merge({id: o.id});
	o.element = $(o.html);
	return o;
}
function MakeButton(name, f) {//takes the function that gets called when stuff happens to the button
	var o = {}
	o.id = id();
	o.name = name;
	var t = Template(`
		<input type="button" id="{{id}}" value="{{name}}"/>
	`);
	o.html = t.merge({id: o.id, name: o.name});
	o.element = $(o.html);
	o.element.click(f);
	o.enable = function(state) {
		o.element.prop("disabled", !state);

	}

	return o;
}
function MakeText(name, contents) {
	var o = {}
	o.id = id();
	o.name = name;
	o.contents = contents;
	var t = Template(`
		<span id="{{id}}-label">{{name}}:<input type="text" id="{{id}}-text" value="{{contents}}"/>
	`);
	o.html = t.merge({id: o.id, name: o.name, contents: o.contents});
	o.element = $(o.html);
	return o;
}


/*

<input type="text" id="unique3" value="default text in the box"/>
<input type="button" id="unique4" value="starting value"/>


*/


/*
var d = Dialog(f)
d.log(s);
d.stick(s);
d.show(true);

stick text has [Button] and Path:[] text areas

function f(e) {
	//called when
	e.message == "key", e.value == enter, k, esc, stuff like that
	e.message == "button", e.value == button text
	e.message == "text", e.value == 

}

write it all for web, worry about terminal later
write it really basic, worry about buttons that are pressed and unavailable later


*/


//make a button that's just a span
//have a div with the keyboard focus get key presses




/*



	$("#snip").click(function() { snip(); });



*/




/*

>is the keybaord focus, dont' worry about this for web

Color:[blue]
takes name and starting text
you can get and set the text
notifies on text change

[Start]
[~Start~]
takes name

before you write the whole ui language, make some simple examples using normal handlebars and jquery first
think about what timer needs

previous recorded durations in a log
current time
running or stopped timer
[Start] which changes to Stop

what does hasher need
Path:[] [Open]

yeah, make this really simple
the goal is not to be complete, it's to make ui for demos really, really quickly
there is no way to set buttons to set or unavailable
the first letter presses that button, so just keep them unique

TWO
here's the first one you write
you pressed a
you pressed b
you pressed c
[A] [B] [C]
and it works from clicking the buttons or pressing the keyboard keys
write that first just in handlebasr and jquery
and that's it, there is no button component, that's exactly what you're trying to avoid
make it so you don't get all keystrokes, just the keystrokes for the buttons that you've put on the dialog

THREE
a simple one that introduces text box
you entered 'your text'
you entered 'your text'
Box:[your text] [Enter]
also, if you name a button [Enter] or [Esc], that key also hits it
yes, this is the kind of stupid direct obviousness that you want, when you're doing anything real later you won't use it

ONE, code this next with jquery and handlebars
in jquery in the page, have some divs, have the color set to the one that has the focus, and log the keyboard keys that you press in them




don't ahve a push button, that's what the checkbox is for
make it all cool and mobile-like
[off]Pause
[on]Pause





*/

/*
later, when you do more ui, here are some ideas

[Button]  normal button
~Button~  unavailable

[x]Checkbox  checked
[ ]Checkbox  unchecked

Path:[default path]

all radio options have to be touching
(x)Red( )Green( )Blue




make
[Start] ~Stop~
~Start~ [Stop]
to demonstrate available and unavailable
[x]Pause
[ ]Pause
is the other one



*/



function dream() {


	var d = Dialog(f);
	d.stick("[A] [B] [C]");
	function f(e) {
		if      (e == "[A]") d.log("you hit a");
		else if (e == "[B]") d.log("you hit b");
		else if (e == "[C]") d.log("you hit c");
		else if (e == "[Esc]") d.log("you hit escape or control+c");//this one works even if you don't have a button

	}

	/*


	*/

	d.get("Path")//returns the current text or boolean contents
	d.set("Button", false)//set the button unavailable
	//or instead, just stick different text with ~Button~
	//you can always use stick to totally change the ui, of course







}








