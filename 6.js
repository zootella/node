
log = console.log;


// Size constants
var Size = {};
Size.kb = 1024;           // Number of bytes in a kilobyte
Size.mb = 1024 * Size.kb; // Number of bytes in a megabyte
Size.gb = 1024 * Size.mb; // Number of bytes in a gigabyte
Size.tb = 1024 * Size.gb; // Number of bytes in a terabyte

Size.value = 20; // A SHA1 hash value is 20 bytes
Object.freeze(Size);

// Time constants
var Time = {};
Time.second = 1000,             // Number of milliseconds in a second
Time.minute = 60 * Time.second, // Number of milliseconds in a minute
Time.hour   = 60 * Time.minute, // Number of milliseconds in an hour
Time.day    = 24 * Time.hour    // Number of milliseconds in a day
Object.freeze(Time);



log(Size.kb);
log(Size.value);









