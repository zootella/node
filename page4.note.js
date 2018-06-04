




/*
make familiar, a little thing in the corner that runs all the tests when you change a file
have it show log output, too
to do this, probably, just run nodeunit in a separate process
later on, it would be cool to run all the tests in the same process, dealing with tests that finish in the next event
but now as you code, you'll actually run that as a separate process, using it rather than building it, even if both are coming from the same code
*/

/*
make log and stick
*/

/*
style to look like the terminal
learn some css and see if you can make Brick
*/
div, p
{
	margin: 0;
	font-family: "Consolas", "Andale Mono", sans-serif;
	font-size: 10pt;
}
.line
{
	background-color: lightblue;
	white-space: pre-wrap;
}

/*
dialog, log, stick, and [Button]
*/
{
	var d = Dialog();
	d.log("log in a dialog");
	d.stick("stick in a dialog with a [button] perhaps");
}

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

	d.get("Path")//returns the current text or boolean contents
	d.set("Button", false)//set the button unavailable
	//or instead, just stick different text with ~Button~
	//you can always use stick to totally change the ui, of course
}









