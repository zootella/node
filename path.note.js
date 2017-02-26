





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




















