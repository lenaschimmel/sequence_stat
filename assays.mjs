const assays = {
    // The "denmark" assays are based on https://www.medrxiv.org/content/10.1101/2021.10.25.21265484v1.full.pdf
    denmark_primary_e_gene: {
        name: "E-gene",
        foreward: "ACAGGTACGTTAATAGTTAATAGCGT",
        reverse: "ATATTGCAGCAGTACGCACACA",
        probe1: "FAM-ACACTAGCCATCCTTACTGCGCTTCG-BHQ1"
    },
    denmark_small_del69_70: {
        name: "ΔH69/V70",
        foreward: "ACATTCAACTCAGGACTTGTTCT",
        reverse: "TCATTAAATGGTAGGACAGGGTT",
        probe1: "HEX-TTCCATGCTATCTCTGGGACCA-BHQ2",
        probe2: "TTCCATGCTATACATGTCTCTGGGACCA" // ATTENTION!
        // The original assays do not have this probe2. I inserted it my self to try something.
    },
    denmark_small_n501y: {
        name: "N501Y",
        foreward: "TGTTACTTTCCTTTACAATCATATGGT",
        reverse: "TGCTGGTGCATGTAGAAGTTCA",
        probe1: "FAM-CCCACTTATGGTGTTGGT-MGB",
        probe2: "Cy5-CCCACTAATGGTGTTGGT-MGB"
    },
    denmark_small_e484k: {
        name: "E484K",
        foreward: "AGGAAGTCTAATCTCAAACCTTTTGA",
        reverse: "GTCCACAAACAGTTGCTGGTG",
        probe1: "FAM-TGGTGTTAAAGGTTTTAAT-MGB",
        probe2: "Texas Red-TGGTGTTGAAGGTTTTAA-MGB"
    },
    denmark_small_l452r: {
        name: "L452R",
        foreward: "CAGGCTGCGTTATAGCTTGGA",
        reverse: "CCGGCCTGATAGATTTCAGT",
        probe1: "HEX-TATAATTACCGGTATAGATTGTT-BHQ1",
        probe2: "Cal Fluor Red 610-TATAATTACCTGTATAGATTGTTTA-BHQ2"
    },
    om_met: {
        name: "OmMet",
        foreward: "AACAAACCTTGTAATGGTGTTGC",
        reverse: "TGCTGGTGCATGTAGAAGTTC",
        probe1: "FAM-GATCATATAGTTTCCGACCCACTTATGGTGTTGGTC-QSY",
       
    }
};

export default assays;