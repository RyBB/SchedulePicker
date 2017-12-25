chrome.browserAction.onClicked.addListener(function(tab) {
	//chrome.tabs.sendMessage(tab.id, "Action");
});

var parentId = chrome.contextMenus.create({
	"title" : "schedule picker",
	"type" : "normal",
	"contexts" : ["all"],
	"id": "parent_id"
});

chrome.contextMenus.create({
	"title" : "Today",
	"type" : "normal",
	"contexts" : ["all"],
	"parentId": parentId,
	"onclick" : ClickToday(),
	"id": "today_id"
});

chrome.contextMenus.create({
	"title" : "Tomorrow",
	"type" : "normal",
	"contexts" : ["all"],
	"parentId": parentId,
	"onclick" : ClickTommrow(),
	"id": "Tomorrow_id"
});

function ClickToday() {
	return function(info, tab) {
		chrome.tabs.sendMessage(tab.id, "Today");
	};
};

function ClickTommrow() {
	return function(info, tab) {
		chrome.tabs.sendMessage(tab.id, "Tomorrow");
	};
};