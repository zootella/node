





// LOG

//make log a real function
//have it use say to call .text() on each part
//have it prefix the day and time to each line so you can see how long things take

var log = console.log;








// ERROR

/*

//have name, info
//info.wrap is an exception we're wrapping
//info.note is a note about what happened

//current usage
throw "chop";
if (e == "chop");
//new usage
throw error("chop");
throw error("chop", {note: "a note about what happened"});
throw error("chop", {wrap: e});
//and checking
if (e.name == "chop") log(e.info.wrap);

function error(name, info) {
	return {
		name: name,
		info: info
	}
}


function error(name, note, more) {
	return {
		name: name,
		note: note,
		more: more
	}
}

//before: throw "data";        if (e == "data");
//after:  throw error("data"); if (e.name == "data");
//so, only 4 characters longer

//and now you can add detailed notes
//and wrap and carry an exception you got in more, for instance

//but you don't have to do the horrible java thing where each kind of exception is a separate type
//or wrap up hashes on the fly, either

*/




















