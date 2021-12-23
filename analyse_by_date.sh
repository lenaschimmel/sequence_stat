#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd $BASEDIR

curl https://api.corona-zahlen.org/germany/history/cases -o data/cases.json
node convert_cases.mjs > data/case_count.csv

DATE=2021-12-01
echo "DATE_DRAW,ALL,OMICRON,RANDOM_ALL,RANDOM_OMICRON" > data/sequence_count.csv

while [ "$DATE" != 2021-12-25 ]; do 
    
    ALL=`xsv search -s DATE_DRAW $DATE data/latest.csv | xsv count`
    OMICRON=`xsv search -s DATE_DRAW $DATE data/result_omicron_metadata.csv | xsv count`
    RANDOM_ALL=`xsv search -s DATE_DRAW $DATE data/latest.csv | xsv search -s SEQ_REASON N | xsv count`
    RANDOM_OMICRON=`xsv search -s DATE_DRAW $DATE data/result_omicron_metadata.csv | xsv search -s SEQ_REASON N | xsv count`
    
    echo "$DATE,$ALL,$OMICRON,$RANDOM_ALL,$RANDOM_OMICRON" >> data/sequence_count.csv

    # GNU date:
    #DATE=$(date -I -d "$DATE + 1 day")
    # BSD / MacOS date:
    DATE=$(date -j -v +1d -f "%Y-%m-%d" $DATE +%Y-%m-%d)
done

xsv join DATE_DRAW data/sequence_count.csv DATE data/case_count.csv | xsv select DATE_DRAW,ALL,OMICRON,RANDOM_ALL,RANDOM_OMICRON,CASES > data/analysis_by_date.csv