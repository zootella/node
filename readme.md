
download the code, update the local copy, notice new files, make and upload changes
<pre>
$ git clone https://github.com/zootella/node
$ git pull
$ git diff > diff.txt
$ git add .
$ git commit -a -n -m "note"
$ git push
</pre>

add a new package, install packages
<pre>
$ npm install -S ~name~
$ npm install -D ~name~
$ npm install
</pre>

run in node and electron on windows and mac
<pre>
$ node load.js
$ node load.js main ~name~

$ electron --version
$ electron load.js
$ electron load.js main ~name~ ~arguments~

$ npm run electron-version
$ npm run electron-load
$ npm run electron-load main ~name~ ~arguments~
</pre>

run and test
<pre>
$ node load.js main ~name~ ~arguments~
$ node load.js test
$ node load.js test ~tag~

$ nodeunit name.test.js
$ nodeunit *.test.js
</pre>
