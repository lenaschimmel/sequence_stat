#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd $BASEDIR

curl https://www.alm-ev.de/wp-json/wpgmza/v1/features/ | jq '[.markers[] | { plz: .custom_field_data[0].value, name: .title, url: .link, adresse: .address}]' > data/labore_flat.json
jq -r '(.[0] | keys_unsorted) as $keys | $keys, map([.[ $keys[] ]])[] | @csv' data/labore_flat.json > data/labore_flat.csv
xsv search -s SEQ_REASON A data/latest.csv | xsv frequency -s SENDING_LAB_PC -l 0 | xsv join value data/Variantenverdacht_PLZ.csv plz data/labore_flat.csv | xsv select count,plz,name,url,adresse > data/Variantenverdacht_full.csv