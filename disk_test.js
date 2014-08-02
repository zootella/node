
require("./load").load("disk_test", function() { return this; });









//at long last, you can open a file
//you can see what it's like to write functions that to from file to string and from string to file









//on mac, try some paths like this
//		l("/folder1", "folder2\\..\\file.ext", "/folder1/folder2\\..\\file.ext");
//and confirm you really get a file with a name that contains backslashes and dots, rather than navigation happening
//if navigation happens, then it's even more important to have the check in open that makes sure the path of the file that was opened is the same as the path you tried to open










