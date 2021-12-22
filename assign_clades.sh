#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd $BASEDIR

nextclade dataset get --name 'sars-cov-2' --output-dir 'data/dataset/sars-cov-2'
nextclade --in-order --input-fasta data/filtered_by_TACCGGTAT.fasta --input-dataset data/dataset/sars-cov-2 --output-dir data/nextclade-output/ --output-csv data/result_clades_and_stuff.csv --verbose
rm data/nextclade-output/*.fasta
xsv select -d ';' seqName,clade data/result_clades_and_stuff.csv > data/result_clades.csv
xsv join seqName data/result_clades.csv IMS_ID data/latest.csv | xsv select 'IMS_ID,DATE_DRAW,RECEIVE_DATE,PROCESSING_DATE,SENDING_LAB_PC,SEQUENCING_LAB_PC,SEQ_REASON,clade' > data/result_clades_and_metadata.csv