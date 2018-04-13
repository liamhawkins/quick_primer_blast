function saveOptions() {
	var select = document.getElementById("blast_settings").value;
    chrome.storage.sync.set({'blast_settings': select}, function(result) {});
    return false
}

document.getElementById("button").onclick = saveOptions
