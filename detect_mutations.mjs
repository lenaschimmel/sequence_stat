import readline from "readline";
import fs from "fs";
import pkg from "central-dogma";
import assays from "./assays.mjs";

const { nucleotide, codon } = pkg;

/*
The wildtype is not needed for this kind of variant detection.

if (process.argv.length != 3) {
  console.error("Need filename of wildtype list as single argument.");
  process.exit(1);
}

var filename = process.argv[2];
const wildtype = fs.readFileSync(filename).toString().split("\n")[1];
*/

function testSequence(sequence, assay) {
  const adjustedReverse = nucleotide.toComplement(
    assay.reverse.split("").reverse().join("")
  );
  const matchForeward = sequence.indexOf(assay.foreward);
  const matchReverse = sequence.indexOf(adjustedReverse);
  if (matchForeward == -1) return "forwared fail";
  if (matchReverse == -1) return "reverse fail " + adjustedReverse;
  if (matchForeward > matchReverse) return "primer order fail";
  const between = sequence.substring(matchForeward, matchReverse);

  // console.log("Test for " + trimProbe(assay.probe1));

  const matchProbe1 = between.indexOf(trimProbe(assay.probe1));
  if (matchProbe1 > -1) return "match probe 1";
  if (assay.probe2) {
    const matchProbe2 = between.indexOf(trimProbe(assay.probe2));
    if (matchProbe2 > -1) return "match probe 2";
  }
  return "probe fail";
}

function trimProbe(fullprobe) {
  const parts = fullprobe.split("-");
  if (parts.length == 1) {
    return parts[0];
  } else if (parts.length == 3) {
    return parts[1];
  } else {
    console.error("Probe syntax error: " + fullprobe);
    process.exit(1);
  }
}

await processSequences();

async function processSequences() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  var currentId = "";
  for await (const line of rl) {
    if (line.charAt(0) == ">") {
      // header line
      currentId = line.substring(1);
    } else {
      // sequence line
      const variant = processSequence(line);
      console.log(currentId + ";" + variant);
    }
  }
}

function processSequence(sequence) {
  var result = {};
  for (const key in assays) {
    if (Object.hasOwnProperty.call(assays, key)) {
      const assay = assays[key];
      result[key] = testSequence(sequence, assay);
      // console.log(assay.name, testSequence(sequence, assay));
    }
  }

  if (result["denmark_primary_e_gene"] != "match probe 1") {
    return "negative";
  }

  if (
    result["denmark_small_del69_70"] == "match probe 2" &&
    result["denmark_small_n501y"] == "match probe 2" &&
    result["denmark_small_e484k"] == "match probe 2" &&
    result["denmark_small_l452r"] == "match probe 1" // mutant
  )
    return "delta";

  if (
    result["denmark_small_del69_70"] == "match probe 1" && // mutant
    result["denmark_small_n501y"] == "match probe 1" && // mutant
    result["denmark_small_e484k"] == "probe fail" && // e484a mutant (a, not k!)
    result["denmark_small_l452r"] == "match probe 2"
  )
    return "omicron ba.1";

  if (
    result["denmark_small_del69_70"] == "match probe 2" &&
    result["denmark_small_n501y"] == "match probe 1" && // mutant
    result["denmark_small_e484k"] == "probe fail" && // e484a mutant (a, not k!)
    result["denmark_small_l452r"] == "match probe 2"
  )
    return "omicron ba.2";

    return "unkown";
}

