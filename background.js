chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("button!");
	chrome.tabs.sendMessage(tab.id, "Action");
});