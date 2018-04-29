console.log(`
a10module PAGE pid ${process.pid}, dirname ${__dirname}
got ${process.argv.length} arguments: ${process.argv}
`);




console.log("try to require vue from the npm module here");



var Vue = require("vue");
//that seemed to work

