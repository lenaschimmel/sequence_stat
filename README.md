# Sequence Stat
Tool(s), um Statistiken aus Sequenzierungen abzuleiten, in erster Linie die aktuelle Omicron-Fallzahl.

## Hintergrund
Deutschland steht kurz vor, oder bereits mitten in, einer fünften Infektionswelle, die durch die SARS-CoV-2-Variante B.1.1.529 alias Omikron getrieben wird. Es herrscht große Unklarheit über den aktuellen Anteil bzw. die Fallzahl dieser Variante.

Meines Wissens nach gibt es bisher noch keine Tagesaktuelle Auswertung der RKI-Sequenzierungen, und das möchte ich ändern.

## Verfahren
 * [x] Daten vom RKI herunter laden
 * [x] Daten entpacken und dabei vorfiltern
 * [x] **WORK IN PROGRESS** Sequenzen auf Mutationen prüfen und (grob) einer Variante zuordnen
 * [ ] Metadaten um zugeordnete Variante erweitern 
 * [ ] Diverse Auswertungen auf diesen Metadaten machen
 * [ ] Auswertungen visualisieren und veröffentlichen

## WORK IN PROGRESS: Sequenzen auf Mutationen prüfen
Natürlich gibt es etablierte Verfahren um in (digitalisierten) Virus-Sequenzen Mutationen und Varianten zu erkennen - aber damit kenne ich mich ehrlich gesagt nicht aus.

Da ich mich in den letzten Wochen ganz grob darin eingearbeitet habe, wie eigentlich Varianten-PCRs funktionieren, und den Vorgang ein paar mal "von Hand" simuliert habe, lag es für mich nahe, zu Testzwecken kurzerhand genau dieses Verfahren implementieren. Das ist sicher nicht das effizienteste oder zuverlässigste Verfahren. Dafür kann ich damit - als Nebenprodukt dieser Software - ein paar Annahmen über PCRs prüfen.

Die Ergebnisse dieser "PCR-Simulation" sind mittelmäßig. Gut genug, schonmal die weiteren Verarbeitungsschritte (statistische Auswertungen) zu testen, aber nicht gut genug, um die Ergebnisse ernst zu nehmen.

Noch ist nicht entschieden, ob ich in Kürze auf ein gänzlich anderes Verfahren zur Varianten-Erkennung wechsle, oder ob ich bei diesem bleibe aber es noch verbessere.
## Datenquelle
In einem [Repository  des RKI](https://github.com/robert-koch-institut/SARS-CoV-2-Sequenzdaten_aus_Deutschland) finden sich (überwiegend) komplette Sequenzen aus derzeit ca. 423.000 Proben inkl. einiger Metadaten:
 * IMS_ID: Eindeutige Kennung
 * DATE_DRAW: Datum der Probenentnahme
 * SEQ_TYPE: Verwendete Sequenzierungs-Plattform
 * SEQ_REASON: Grund der Sequenzierung
 * SAMPLE_TYPE: Art der Probe (grob: wo am Körper entnommen)
 * OWN_FASTA_ID: Labor-Interne ID, verschlüsselt
 * RECEIVE_DATE: Verarbeitungsdatum im RKI
 * PROCESSING_DATE: 
 * SENDING_LAB_PC: Die Postleitzahl des primärdiagnostischen Labors
 * SEQUENCING_LAB_PC: Die Postleitzahl des sequenzierenden Labors

## Tools
### `download_filter.sh`
Dieses Bash-Skript lädt alle Sequenzdaten herunter, speichert dabei aber nur die aus den Monaten November und Dezemeber 2021. Ohne diese on-the-fly-Filterung würden über 12 GB Speicherplatz benötigt, so sind es aber *nur* 2,4 GB.
### `detect_mutations.sh`
Sucht mit einem ziemlich wackeligem Verfahren (siehe oben: "WORK IN PROGRESS: Sequenzen auf Mutationen prüfen") nach Mutationen und weist Varianten zu. Die Ergebisse werden in `data/variants.csv` geschrieben und ein paar Statistiken ausgegeben.

### Weitere Tools folgen bald...
## Requirements:
 * 2,5 GB freier Speicher
 * bash oder äquivalente Shell
 * [xsv](https://github.com/BurntSushi/xsv)
 * Node.js >= v14.8

