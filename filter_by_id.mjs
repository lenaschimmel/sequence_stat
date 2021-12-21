import readline from "readline";
import fs from "fs";

if(process.argv.length != 3) {
  console.error("Need filename of ID list as single argument.");
  process.exit(1);
}

var filename = process.argv[2];
var ids = await readIds(filename);
await filterInput(ids);

async function readIds() {
  var ids = new Set();

  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    ids.add(">"+line);
  }

  return ids;
}

async function filterInput(ids) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  var useNextLine = false;
  for await (const line of rl) {
    if (line.charAt(0) == ">") { // header line
      if(ids.has(line)) {
        console.log(line);
        useNextLine = true;
      } 
    } else { // sequence line
      if (useNextLine) {
        console.log(line);
      }
      useNextLine = false;
    }
    
  }
}