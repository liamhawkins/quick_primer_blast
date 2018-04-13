isDNA = function(sequence){
    if (sequence.match('[^ACGTacgt]' || sequence.length < 7)) {
        return false;
    } else {
        return true;
    }
};

blastPrimers = function(word){
        chrome.storage.sync.get('blast_settings', function(result) {
            var settings = result['blast_settings'].split("?LINK_LOC=bookmark&")[1];
            alert(settings);
            var query = word.selectionText
            var split_query = query.split(/[\s\n\t\r]+/)
            var identifier = [];
            var nuc_seq = [];
            var foundDNA = 0;
            for (var i = 0; i < split_query.length; i++) {
                if (isDNA(split_query[i]) == false && foundDNA == 0) {
                    identifier.push(split_query[i]);
                } else {
                    nuc_seq.push(split_query[i]);
                    foundDNA = 1;
                };
            };
            var query = nuc_seq.join("");
            chrome.tabs.create({url: "https://www.ncbi.nlm.nih.gov/tools/primer-blast/primertool.cgi?INPUT_SEQUENCE=" + query + "&" + settings});
        });
};

chrome.contextMenus.create({
     title: "Blast for primers",
      contexts:["selection"],  // ContextType
       onclick: blastPrimers // A callback function
});
