














//notes about the anatomy of load and the single huge illustrated text file
function load() {

/*
welcome message

assembly instructions
8 easy steps that take about x minutes and x clicks
you don't have to be a programmer, just a computer user comfortable with stuff like zip files and installing programs

[1] check the hash

first, make sure no one has edited this file
line0 is a hash container, line1 is a null spacer
open notepad and copy line0 there
replace letters and numbers in line0 with #s so it looks the same as line1 below
save, check file size same number of bytes, windows line endings \r\n 0d0a
sha1sum command on win, mac, linux
remove the middle line, identity.hash, to check that hash of this file, then put it back so the program can, too
*/

var identity = {};
identity.name = "zootella";
identity.line = "----------------------------------------";
identity.hash = "da39a3ee5e6b4b0d3255bfef95601890afd80709"; // Remove this line to check this hash
identity.line = "----------------------------------------";
identity.date = 20171001;

/*
[2] decide if you trust the hash, decide if you trust the code

then, decide if you trust this file
where did you get this from
search for the hash, do other people say its ok
do a diff, to a previous version, or another source
read the code
search the news

[3] install node and npm

[4] run npm init

what if one of these libraries has been tampered with?
npm shows popularity, the less popular ones are more vulnerable

[5] download electron

[6] make some more files

notepad, mac, leafpad
copy from these parts to those files
rename this file to index.html
from the { to the } and from the < to the >
*/

identity["package.json"] = `
	...
`;

identity["index.html"] = `
	...
`;

/*
[7] download artwork

optional, works fine without
icons for mac and windows, probably .ico and .icns
have web download locations
have hashes you can check, these hashes won't change

[8] run

steps to run on win, mac, pi
make shortcuts
what files it makes while it's running
how to carry it with you
*/

//rest of load

}
load();

contain(function(expose) {

//container contents

});

contain(function(expose) {

//container contents

});

contain(function(expose) {

//container contents

});












/*
you figured out how to distribute the entire working application
-as a single file
-that resists tampering
-that is entirely human readable
-that can contain lot of extra stuff

the single text file contains
-instructions
-application code
-demos and apps
-librarty code
-tests
-interactive code and documentation browser
-story novel
-how to code book
-structure maps
-ascii art
-poetry

there are diagrams and maps like rogue
there are headings and borders like gamefaqs

there are contents and hyperlinks with control+f
there could be a choose your own adventure book with control+f
*/

/*
zootella.txt
at the start are instructions for validating and assembly
say, you can do this in x minutes with about x clicks
change the top to xxxx
then sha1 sum, find the command on windows, mac, and rasbperry pi

check the hash
do you trust the hash, search for the hash
read the news
read the code
diff the code

first, make sure no one has edited this file
then, decide if you trust that hash
make some more files
get electron
get node modules
*/

/*
ways to get the program
-download preassembeled from the website
-download single file, follow assembly instructions
-reproduction system: your friend clicks distribute in their running app, then ims you the zip file the program creates, and this contains a list of peers so it works without a central bootstrapping server running
*/

/**
in the huge text file of everything, double asterisk is a special code

in here, a postprocessor wraps neighboring lines

#Header
gets expanded into bubble letters

and a bookreader app written within can pull these sections out, and turn them into nice html
there's no code in here, rather, code is between them
this is how you make the demo sections, for instance

[Data>] is a link, and
[>Data] is a link target
in the reader, these become wiki style hyperlinks
but you can also just ctrl+f them
[Google>http://www.google.com/] is how you'd do a web link, except you might not have any of those
**/

/*
 .= .-_-. =.
((_/)o o(\_))
 `-'(. .)`-'
  /| \_/ |\
 ( | GNU | )
 /"\_____/"\
 \__)   (__/

format the gpl into two columns, with the gnu in the middle between them
and lots of scallops and frames around the top and bottom
*/







