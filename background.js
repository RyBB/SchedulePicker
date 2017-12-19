function ajaxEventListRequest() {
	const ajaxURL = 'https://bozuman.cybozu.com/g/schedule/ajax_event_list.csp';
	const MAX_MEMBER_NUM_TO_SEND = 20;
	const memberdata = '{"id":"1788","type":"user","selected":true,"colorId":"0"}';

	$.ajax({
    	url: ajaxURL,
    	method: "POST",
		dataType: "json",
		//contentType: "application/jsonp",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		headers:{
			"X-Requested-With": "XMLHttpRequest",
			"Cache-Control": "no-cache"
		},
		data: {
			begin_date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() ,
			number_of_days: "1",
			uid: "",
			gid: "selected",
			selected_group_type: "", 
			"members[]":memberdata,
			referer_key:"81185dc4a58cf5dbcf1532133cb6d851",
			use_ajax: "1"
		}
	}).done(function(result) {
		console.log("4-1!");
		console.log(result);
	}).fail(function(result) {
		console.log("4-2!");
		console.log(result.members);
	});;
	return true;
}

let main = () => {
	this.ajaxEventListRequest()
};

chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("button!");
	chrome.tabs.sendMessage(tab.id, "Action");
	if(false){
		main();
	}
});