


/*
think of a way to turn off loading neighboring files if the program is shipping in a single file
just if (true) and then change that to false, probably
*/

/*
convert local nodeunit to centralized tape
and make sure command line reporting is no worse

or wait, do switch to centralized tests, and switch to tape
and then you run all the tests always with $ node load test, which runs tape across all the tests
and logs tap to standard out, or no, use the pretty mocha style output that works
and dont worry about pop quiz until later

make sure the mocha style output shows
-filename and line number
-call stacks
-exception that got thrown
*/

/*
have another kind of thing: page
it's a main that runs in electron
yeah, this is cool and it's four letters

but no, because lots of your pages will be small enough you want them all in the same file
and others will be so big you want them in separate files
*/

/*
write a tape sample on the side that
confirms you can do
ok(false) for fail, now you don't need fail actually
throws(f), that's cool, switch to that
several tests in a row that take 1s each, last doesn't finish, does tape notice
does nodeunit notice for that matter, actually
*/

/*
notice and stop if you try to overwrite something
baloons that can be written in any file and in any order
commands to combine and separate
modes to import explicitly, or just use global
*/

/*
try out these frameworks
-nodeunit
-mocha and chai
-tape and tap

in the code
-ok(true)
-done()

run the tests
-from the command line
-from inside the running process
*/

/*
make sure that tape works as well as nodeunit, showing
-file names
-test names
-number of passed assertions
-milliseconds the whole thing took to run
-failures in red
-logged lines from a test that's logging
-exceptions with call stack
-call stack with file names and line numbers
*/







