isDNA = function(sequence){
    if (sequence.match('[^ACGTNacgtn]') || sequence.length < 7) {
        return false;
    } else {
        return true;
    }
};

hasAccession = function(split_selection){
	var accessions = ['AC','NC','NG','NT','NW','NZ','NM','NR','XM','XR'];
	if (!(isDNA(split_selection[0])) && accessions.indexOf(split_selection[0].split("_")[0]) >= 0){
		return true;
	} else {
		return false;
	};
};

blastPrimers = function(word){
        chrome.storage.sync.get('blast_settings', function(result) {
			if (typeof result['blast_settings'] == "undefined") {
				var settings = "&OVERLAP_5END=7&OVERLAP_3END=4&PRIMER_PRODUCT_MIN=70&PRIMER_PRODUCT_MAX=1000&PRIMER_NUM_RETURN=10&PRIMER_MIN_TM=57.0&PRIMER_OPT_TM=60.0&PRIMER_MAX_TM=63.0&PRIMER_MAX_DIFF_TM=3&EARCH_SPECIFIC_PRIMER=on&EXCLUDE_ENV=off&EXCLUDE_XM=off&TH_OLOGO_ALIGNMENT=off&TH_TEMPLATE_ALIGNMENT=off&ORGANISM=Homo%20sapiens&PRIMER_SPECIFICITY_DATABASE=refseq_mrna&TOTAL_PRIMER_SPECIFICITY_MISMATCH=1&PRIMER_3END_SPECIFICITY_MISMATCH=1&MISMATCH_REGION_LENGTH=5&TOTAL_MISMATCH_IGNORE=6&MAX_TARGET_SIZE=4000&ALLOW_TRANSCRIPT_VARIANTS=off&HITSIZE=50000&EVALUE=30000&WORD_SIZE=7&MAX_CANDIDATE_PRIMER=500&PRIMER_MIN_SIZE=15&PRIMER_OPT_SIZE=20&PRIMER_MAX_SIZE=25&PRIMER_MIN_GC=20.0&PRIMER_MAX_GC=80.0&GC_CLAMP=0&NUM_TARGETS_WITH_PRIMERS=1000&NUM_TARGETS=20&MAX_TARGET_PER_TEMPLATE=100&POLYX=5&SELF_ANY=8.00&SELF_END=3.00&PRIMER_MAX_END_STABILITY=9&PRIMER_MAX_END_GC=5&PRIMER_MAX_TEMPLATE_MISPRIMING_TH=40.00&PRIMER_PAIR_MAX_TEMPLATE_MISPRIMING_TH=70.00&PRIMER_MAX_SELF_ANY_TH=45.0&PRIMER_MAX_SELF_END_TH=35.0&PRIMER_PAIR_MAX_COMPL_ANY_TH=45.0&PRIMER_PAIR_MAX_COMPL_END_TH=35.0&PRIMER_MAX_HAIRPIN_TH=24.0&PRIMER_MAX_TEMPLATE_MISPRIMING=12.00&PRIMER_PAIR_MAX_TEMPLATE_MISPRIMING=24.00&PRIMER_PAIR_MAX_COMPL_ANY=8.00&PRIMER_PAIR_MAX_COMPL_END=3.00&PRIMER_MISPRIMING_LIBRARY=AUTO&NO_SNP=off&LOW_COMPLEXITY_FILTER=on&MONO_CATIONS=50.0&DIVA_CATIONS=1.5&CON_ANEAL_OLIGO=50.0&CON_DNTPS=0.6&SALT_FORMULAR=1&TM_METHOD=1&PRIMER_INTERNAL_OLIGO_MIN_SIZE=18&PRIMER_INTERNAL_OLIGO_OPT_SIZE=20&PRIMER_INTERNAL_OLIGO_MAX_SIZE=27&PRIMER_INTERNAL_OLIGO_MIN_TM=57.0&PRIMER_INTERNAL_OLIGO_OPT_TM=60.0&PRIMER_INTERNAL_OLIGO_MAX_TM=63.0&PRIMER_INTERNAL_OLIGO_MAX_GC=80.0&PRIMER_INTERNAL_OLIGO_OPT_GC_PERCENT=50&PRIMER_INTERNAL_OLIGO_MIN_GC=20.0&PICK_HYB_PROBE=off&NEWWIN=off&NEWWIN=off&SHOW_SVIEWER=true";
			} else {
				var settings = result['blast_settings'].split("?LINK_LOC=bookmark")[1];
			};

            var selection = word.selectionText.replace(">","");
			var split_selection = selection.split(/[\s\n\t\r|]+/)
			if (hasAccession(split_selection)) {
				var query = split_selection[0];
			} else {
				var identifier = [];
				var nuc_seq = [];
				var foundDNA = 0;
				for (var i = 0; i < split_selection.length; i++) {
					if (isDNA(split_selection[i]) == false && foundDNA == 0) {
						identifier.push(split_selection[i]);
					} else if (isDNA(split_selection[i]) == true) {
						nuc_seq.push(split_selection[i]);
						foundDNA = 1;
					};
				};
				var query = nuc_seq.join("");
			};
            chrome.tabs.create({url: "https://www.ncbi.nlm.nih.gov/tools/primer-blast/primertool.cgi?INPUT_SEQUENCE=" + query + settings});
        });
};

chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({url: chrome.runtime.getURL("options.html")});
});

chrome.contextMenus.create({
     title: "Blast for primers",
      contexts:["selection"],  // ContextType
       onclick: blastPrimers // A callback function
});

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html")});
});
