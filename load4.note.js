



/*
use webpack to live reload a html page
$ git clone https://github.com/zootella/reload
$ cd reload
$ npm install
$ npm run dev

run your tests
$ npm install -g nodeunit
$ nodeunit --version
$ nodeunit *.test.js

make a new package.json, and rebuild node_modules from one
$ mkdir name1
$ cd name1
$ npm init -y
$ npm install

install node
$ node --version
$ npm --version
$ npm install -g npm

install electron globally
$ npm install -g electron
$ electron --version
$ electron -i
$ electron
$ electron .

install electron locally
$ npm install -S electron
"scripts": {
	"electron-version": "electron --version",
	"electron-repl":    "electron -i",
	"electron-empty":   "electron",
	"electron-here":    "electron ."
},
$ npm run electron-version
$ npm run electron-repl
> .exit
$ npm run electron-empty
$ npm run electron-here

place electron manually
https://electronjs.org/releases
electron-v1.8.4-win32-x64.zip  50.3 MB
electron-v1.8.4-darwin-x64.zip 48.3 MB
$ electron/win/electron.exe --version
$ electron/mac/Electron.app/Contents/MacOS/Electron --version

run electron three ways, dirname is the same
$ electron .
$ npm run electron-here
$ electron/win/electron.exe .
*/

/*
update mistake 

for promises and electron, understand and control the behavior of
the system streams, like log and error
exceptions, like {}.notHere.nope;

write {}.notHere.nope; different places to see how it throws
in node
in electron main and renderer
after setImmediate
after promises
and figure out where you want it to go
probably not causing node to exit the process
and not in a message box before the electron window shows up
and not in command tools, either
*/

/*
global electron works on windows, but not mac, fix your mac somehow
electron interactive, the repl, works on mac but not windows, by design

github wrote the electron repl -i to work on mac, but haven't made it work on widnows yet
installing electron globally on windows works, and on your mac it doesn't, because your computer is messed up somehow
npm gets windows electron on windows and mac electron on mac, so if you npm installed on windows, you can't npm run on mac
if you unzip electron on mac, the binary executable Electron will have the last x bit set, and it works, not so from dropbox

right now on windows, the electron in npm_modules is from mac, because dropbox brought it over
and yet $ npm run electron-version still works somehow
probably just because npm uses global before node_modules, maybe?
*/

/*
ways to code and run this include:
-for development,
-the secure build for advanced computer users from a single text file,
-and the downloadable consumer packages that install normally mac/win/raspbian,
-and the portable usb version you can carry between mac/win/raspbian

launch from usb key portable between mac and windows
launch from installed location on windows, and a shortcut on the start menu
launch from installed location on mac, dragged into the applications folder, then drag a document onto it
and check command line arguments getting passed through with all that
*/

/*
a useful project would be:
make a little notepad editor that edits a file it keeps in its folder
package it as a portable application, and edit the file as you carry it from window, mac, and raspbian
if you can do that, you can make all the installers, too
*/







