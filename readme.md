
download the code, update the local copy, notice new files, make and upload changes
<pre>
$ git clone https://github.com/zootella/node
$ git pull
$ git add .
$ git commit -a -n -m "note"
$ git push
</pre>

add a new package, install packages
<pre>
$ npm install -D package-name
$ npm install
</pre>

run in node and electron on windows and mac
<pre>
$ node
$ node load
$ node load main ~name~

$ electron/win/electron.exe
$ electron/win/electron.exe .
$ electron/win/electron.exe . main ~name~

$ electron/mac/Electron.app/Contents/MacOS/Electron
$ electron/mac/Electron.app/Contents/MacOS/Electron .
$ electron/mac/Electron.app/Contents/MacOS/Electron . main ~name~
</pre>

run and test
<pre>
$ node load main ~name~ ~arg1~ ~arg2~ ~arg3~
$ node load test
$ node load test ~tag~

$ nodeunit name.test.js
$ nodeunit *.test.js
</pre>