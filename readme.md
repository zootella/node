
download the code, update the local copy, install packages
<pre>
$ git clone https://github.com/zootella/node
$ git pull
$ npm install
</pre>

add a new package, notice new files, upload changes
<pre>
$ npm install package-name --save-dev
$ git add .
$ git commit -a -n -m "note"
</pre>

run the tests, run a demo, run in electron
<pre>
$ ./node_modules/nodeunit/bin/nodeunit *_test.js
$ nodeunit *_test.js
$ node file.js demo name
$ ./electron/win/electron.exe app-name/
$ ./electron/mac/Electron.app/Contents/MacOS/Electron app-name/
</pre>
