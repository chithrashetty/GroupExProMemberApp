let fs = require('fs');
let path = require('path');

let option = String();

// Get parameter from build command
if (process.argv[4] === undefined || process.argv[4] === null) {
    console.log("No option provided for build environment. Continuing with default 'prod'...")
    option = 'prod';
} else {
    option = process.argv[4].replace('-', '');
    console.log("Running beforeBuild.js | Environment: " + option);
}

// Check the filepath and set the file contents
const filepath = path.resolve('www/config/env.json');
console.log(filepath);
let contents = "{\n\t\"env\": \"" + option + "\"\n}"

// Write to the file
const fd = fs.openSync(filepath, 'w+');
fs.writeSync(fd, contents);
console.log("'env.json' file written with option: " + option);
