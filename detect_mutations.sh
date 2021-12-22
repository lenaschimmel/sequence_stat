#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd $BASEDIR

cat data/filtered.fasta | node detect_mutations.mjs data/wildtyp.fasta > data/variants.csv
xsv frequency -l 0 -s 2 -d ";" -n data/variants.csv | xsv table