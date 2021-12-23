# Sequence Stat
Tool(s), um Statistiken aus Sequenzierungen abzuleiten, in erster Linie die aktuelle Omicron-Fallzahl.

**⚠️⚠️WICHTIG⚠️⚠️ Die Tools und Daten aus diesem Repository sind eigentlich überflüssig und sollten i.d.R. nicht benutzt werden**

Am Morgen des 23.12. kam heraus, dass das [Original-Repository des RKI](https://github.com/robert-koch-institut/SARS-CoV-2-Sequenzdaten_aus_Deutschland) bereits eine Datei mit den Varianten-Zuordnungen besitzt, die nur bisher übersehen wurde. Es handelt sich um [SARS-CoV-2-Entwicklungslinien_Deutschland.csv.xz](https://github.com/robert-koch-institut/SARS-CoV-2-Sequenzdaten_aus_Deutschland/blob/master/SARS-CoV-2-Entwicklungslinien_Deutschland.csv.xz).

Ein bisschen Kontext dazu, wie das passieren konnte, gibt's [in diesen Tweets](https://twitter.com/LenaSchimmel/status/1473924350852177921).

## Hintergrund
Deutschland steht kurz vor, oder bereits mitten in, einer fünften Infektionswelle, die durch die SARS-CoV-2-Variante B.1.1.529 alias Omikron getrieben wird. Es herrscht große Unklarheit über den aktuellen Anteil bzw. die Fallzahl dieser Variante.

Meines Wissens nach gibt es bisher noch keine Tagesaktuelle Auswertung der RKI-Sequenzierungen, und das möchte ich ändern.

## Verfahren
 * [x] Daten vom RKI herunter laden
 * [x] Daten entpacken und dabei vorfiltern
 * [x] Sequenzen auf Mutationen prüfen und Verdachtsfälle vorfiltern
 * [x] Verdachtsfälle mittels [nextclade](https://docs.nextstrain.org/projects/nextclade/en/stable/index.html) eindeutig einer Variante zuordnen
 * [x] Metadaten um zugeordnete Variante erweitern 
 * [ ] Diverse Auswertungen auf diesen Metadaten machen
 * [ ] Auswertungen visualisieren und veröffentlichen

### Sequenzen auf Mutationen prüfen und Verdachtsfälle vorfiltern
Nach einigen umständlichen Versuchen (z.B. selbst gebastelte, grobe Simulation von PCR mit Primer und Probe) gehe ich nun so vor: alle Sequenzen, die den Abschnitt `TACCGGTAT` enthalten, sind mit extremer Wahrscheinlichkeit kein Omicron, sondern irgendwas wenig interessantes (Delta, Kappa, Lambda), und werden nicht näher betrachtet. Damit fallen 97,6% der Sequenzen raus, entsprechend viel schneller geht der nächste Schritt.
### Verdachtsfälle mittels nextclade eindeutig einer Variante zuordnen
Im Wesentlichen ganz normale Verwendung von nextclade gemäß [Dokumentation](https://docs.nextstrain.org/projects/nextclade/en/stable/user/nextclade-cli.html).

### Metadaten um zugeordnete Variante erweitern
Mit `xsv join` werden die Varianten-Zuordnungen aus nextclade mit den Metadaten aus der Datenquelle vereint.

### Diverse Auswertungen auf diesen Metadaten machen
Siehe Tool `analyse_by_date.sh` weiter unten.
## Tools
### `download_and_filter.sh`
Dieses Bash-Skript lädt alle Sequenz- und Metadaten herunter, speichert dabei aber nur die aus den Monaten November und Dezemeber 2021.

Aus den Sequenzdaten filtert es außerdem noch alle raus, die sehr eindeutig nach Delta ausschauen.

Ohne diese beiden on-the-fly-Filterungen würden über 12 GB Speicherplatz auf der Platte belegt, so sind es aber 61 MB.
### `detect_mutations.sh`
*Wird im aktuellen Workflow gar nicht mehr gebraucht, verbleibt aber für künftige Experimente*

### `analyse_by_date.sh`
Lädt von [corona-zahlen.org](https://api.corona-zahlen.org/) die gesammten Fahlzahlen herunter.

Für jeden Tag vom 1. Dezember bis zum aktuellen Tag wird jeweils bestimmt:
 * ALL - Anzahl durchgeführte Sequenzierungen
 * OMICRON - Anzahl Omicron-Fälle an allen durchgeführtem Sequenzierungen
 * RANDOM_ALL - Anzahl Sequenzierungen der Zufallsprobe, d.h., die ohne Verdacht auf eine Variante angeordnet wurden
 * RANDOM_OMICRON - Anzahl Omicron-Fälle an den Zufallsproben
 * CASES - Neue bestätigte Fälle an jenem Tag (incl. nicht-sequenzierter PCRs)

Das Ergebnis wird in `data/analysis_by_date.csv` geschrieben.

Bezugspunkt ist immer **das Datum, an dem die Probe genommen wurde**.
### `assign_clades.sh`
Lässt die vorgefilterten Sequenzen mit nextclade analysieren und erzeugt eine Metadaten-csv, die auch die Angabe der Variante als Spalte enthält.
### Weitere Tools folgen bald...
## Requirements:
 * bash oder äquivalente Shell
 * curl
 * [xsv](https://github.com/BurntSushi/xsv)
 * Node.js >= v14.8
 * [nextclade CLI](https://docs.nextstrain.org/projects/nextclade/en/stable/user/nextclade-cli.html), nativ (also nicht Docker), mit dem Kommando `nextclade` im `PATH`
 * nur ca. 10 MB freier Speicher (nach Installation der Requirements)

## Aufruf
Nachdem alle Requirements erfüllt sind:
```
./download_and_filter.sh
./assign_clades.sh
```

Verschiedenste Daten liegen dann unter `data/`.

## Ergebnisse
Es gibt noch keine fertige Analyse. Erste Zwischenergebnisse:
 * [Die 749 PCR-bestätigten Omikron-Fälle, Stand 22.12.2021, jeweils inkl. Grund der Proben-Entnahme, drei Zeit- und zwei Orts-Angaben](https://gist.github.com/lenaschimmel/35d553e2e615a98b56542bff7b66e56f)
 * [Datumsbezogene Auswertung Omikron-Fälle, Stand 2021-12-22](https://gist.github.com/lenaschimmel/23e0930aab3d09ab749765e3afa774d3)
  
## Kontakt und weitere Infos
Updates über den Fortschritt der Tools und Analyse-Ergebnisse gibt's auf Twitter unter [@LenaSchimmel](https://twitter.com/LenaSchimmel). Eventuell (!) in Zukunft auch über einen gesonderten Account.

Fragen und Anregungen gerne auch per Twitter, oder hier in den Issues.

## Datenquelle
In einem [Repository  des RKI](https://github.com/robert-koch-institut/SARS-CoV-2-Sequenzdaten_aus_Deutschland) finden sich (überwiegend) komplette Sequenzen aus derzeit ca. 423.000 Proben inkl. einiger Metadaten:
 * IMS_ID: Eindeutige Kennung. Die Fünfstellige Zahl hinter `IMS-` ist die Kennung des Labors gemäß
 * DATE_DRAW: Datum der Probenentnahme
 * SEQ_TYPE: Verwendete Sequenzierungs-Plattform
 * SEQ_REASON: Grund der Sequenzierung
 * SAMPLE_TYPE: Art der Probe (grob: wo am Körper entnommen)
 * OWN_FASTA_ID: Labor-Interne ID, verschlüsselt
 * RECEIVE_DATE: Verarbeitungsdatum im RKI
 * PROCESSING_DATE: 
 * SENDING_LAB_PC: Die Postleitzahl des primärdiagnostischen Labors
 * SEQUENCING_LAB_PC: Die Postleitzahl des sequenzierenden Labors

## Lizenz und Namensnennung
Der Code steht unter MIT Lizenz.

Die Analysen basieren auf Daten des Robert Koch-Instituts unter CC-BY 4.0 Internation Lizenz. Siehe [hier](https://github.com/robert-koch-institut/SARS-CoV-2-Sequenzdaten_aus_Deutschland#lizenz).

Die Analyse-Ergebnisse stehen ebenfalls unter CC-BY 4.0 Internation Lizenz, Namensnennung: "Lena Schimmel & Robert Koch-Institut".