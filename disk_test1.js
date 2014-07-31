

require("./load").load("disk_test", function() { return this; });


//sources: if you have all the features, and deal with all the concerns of these libraries, your node disk library will be very complete
//posix man pages
//node docs
//java chan
//win32 backup.exe
//win32 lwire.dll

//in the api, but not used in this first pass
//truncate a file without opening it
//get and change permissions
//deal with symbolic links
//get and modify timestamps
//fsync flush to disk
//watch for changes on a file or directory

//make sure you can deal with
//unicode paths
//avoid files already there
//illegal characters on the filesystem you happen to be on
//windows disk and network neighborhood paths
//paths longer than max path characters
//get present working directory
//see what kind of paths you get in node webkit running from disk and a network share
//node cant read or set the windows readonly attribute, does this prevent it from deleting a read only file, is there a solution other than a child process

//does it work with really big files, larger than a dword
//does it work with really long paths, longer than max path characters

//maybe don't throw exceptions at all, maybe exceptions dont work well with async, just catch them and keep them and read them as values

//bake util.inspect into log

//don't make this more complicated than you need it to be--all you need to do is make sure that functions only get passed absolute paths, you don't have to naviagate or add or substract paths, or compare paths, or change capitalization, and if you did, node's path library is there to help
//get node webkit going so you can run it from windows disk, windows share, and mac, and linux, and see what the current path looks like and portable paths, and see what kinds of paths you get from the file open dialog box
//don't use realpath, the cache means its slow, just go right to the actual thing you want to do with the path, like open it or create it or see if it's available or list it

//once path is done, that's where you could add in methods like up, down, so on, the path arithmatic offered by the node path module





















