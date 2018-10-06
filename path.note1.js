





/*
first, see that it actually is slow

also, watch it check a single long path
how many paths does it create

then, here's how you coudl build a cache
if more than 100ms has passed since this cache was started, throw it out, and start a new one
keep the most recent path that is each level deep

the most recent path that is
1 level deep: C:
2 levels:     C:\folder
3 levels:     C:\folder\folder
then when looking for a newly resolved path, see if you match the one there, use it if so, if not resolve your own, and store it there







*/




/*
instead of returning the linked list thing, return a nice array with the paths in order
like an array with these parts:

C:\
C:\folder1
C:\folder1\folder2
C:\folder1\folder2\name.ext

here is the really simple cache that will make it fast
path caches an array of the last validated path object it made that is
1 level deep
2 levels deep
3 levels deep
and so on
when you're validating a new one 3 levels deep, see if your 2 level container is already in the cache
if so, use it
if not, validate a new one, and then put that one in the cache
this is really simple and will work really well when validating a whole list of nested files and folders

because none of this ever actually looks at the disk, the cache can stick around for the life of the process, you don't need to expire stale entries or something
later for disk you probably will somehow

and path, of course, just checks that the paths look ok, without doing any checking on any real disk
inside disk, instead, there's a very similar validator that does the same thing but does look at the disk
path is synchronous, while the disk checker of course returns a promise




*/















