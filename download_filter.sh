#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd $BASEDIR

REPO=https://github.com/robert-koch-institut/SARS-CoV-2-Sequenzdaten_aus_Deutschland
RAW=https://raw.githubusercontent.com/robert-koch-institut/SARS-CoV-2-Sequenzdaten_aus_Deutschland/master

# Metadaten als csv herunterladen, dabei direkt entpacken und nur Zeilen aus November und Dezember 2021 speichern
# TODO regex rechtzeitig anpassen, um auch Proben von 2022 zu akzeptieren
curl ${RAW}/SARS-CoV-2-Sequenzdaten_Deutschland.csv.xz | unxz | xsv search -s DATE_DRAW "2021-(11|12)-.." > data/latest.csv

# Extrahiere die IDs dieser Sequenzen in eine eigene Datei.
xsv select IMS_ID data/latest.csv | tail -n +2 > data/IMS_ID.csv

# Als nächstes die eigentlichen Sequenzen herunter laden. Der Download ist "nur" ca. 30 MB groß, aber entpackt über 12 GB.
# Damit längst nicht so viel Speicherplatz gebraucht wird, speichern wir auch hier nur die aktuellen Zeilen.
# Da in der .fasta-Datei keine Datumsangaben stehen, filtern wir nach den IDs, die wir in IMS_ID.pattern haben.
curl ${RAW}/SARS-CoV-2-Sequenzdaten_Deutschland.fasta.xz | unxz | node filter_by_id.mjs data/IMS_ID.csv > data/filtered.fasta
# Das würde theoretisch auch mit `grep -f` funktionieren, ist aber *viel* langsamer als dieses Node-Skript, das auf den
# speziellen Anwendungsfall optimiert ist.