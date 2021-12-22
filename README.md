# Sequence Stat
Tool(s), um Statistiken aus Sequenzierungen abzuleiten, in erster Linie die aktuelle Omicron-Fallzahl.

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

## Sequenzen auf Mutationen prüfen und Verdachtsfälle vorfiltern
Nach einigen umständlichen Versuchen (z.B. selbst gebastelte, grobe Simulation von PCR mit Primer und Probe) gehe ich nun so vor: alle Sequenzen, die den Abschnitt `TACCGGTAT` enthalten, sind mit extremer Wahrscheinlichkeit kein Omicron, sondern irgendwas wenig interessantes (Delta, Kappa, Lambda), und werden nicht näher betrachtet. Damit fallen 97,6% der Sequenzen raus, entsprechend viel schneller geht der nächste Schritt.
## Verdachtsfälle mittels nextclade eindeutig einer Variante zuordnen
Im Wesentlichen ganz normale Verwendung von nextclade gemäß [Dokumentation](https://docs.nextstrain.org/projects/nextclade/en/stable/user/nextclade-cli.html).

## Metadaten um zugeordnete Variante erweitern
Mit `xsv join` werden die Varianten-Zuordnungen aus nextclade mit den Metadaten aus der Datenquelle vereint.
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
### `download_and_filter.sh`
Dieses Bash-Skript lädt alle Sequenz- und Metadaten herunter, speichert dabei aber nur die aus den Monaten November und Dezemeber 2021.

Aus den Sequenzdaten filtert es außerdem noch alle raus, die sehr eindeutig nach Delta ausschauen.

Ohne diese beiden on-the-fly-Filterungen würden über 12 GB Speicherplatz auf der Platte belegt, so sind es aber 61 MB.
### `detect_mutations.sh`
*Wird im aktuellen Workflow gar nicht mehr gebraucht, verbleibt aber für künftige Experimente*
### `assign_clades.sh`
Lässt die vorgefilterten Sequenzen mit nextclade analysieren und erzeugt eine Metadaten-csv, die auch die Angabe der Variante als Spalte enthält.
### Weitere Tools folgen bald...
## Requirements:
 * 2,5 GB freier Speicher
 * bash oder äquivalente Shell
 * [xsv](https://github.com/BurntSushi/xsv)
 * Node.js >= v14.8
 * [nextclade CLI](https://docs.nextstrain.org/projects/nextclade/en/stable/user/nextclade-cli.html), nativ (also nicht Docker), mit dem Kommando `nextclade` im `PATH`
