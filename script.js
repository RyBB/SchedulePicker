chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

	// 現在フォーカスが与えられている要素を取得する
	let active_element = document.activeElement;
	let date = new Date();

	getSchedule(date).done(function (xml) {
		var schedule = new Array();
		var index = 0;

		schedule = format($xml);

		let target_area = active_element.id;
		if (target_area != "") {
			console.log(schedule);
			document.getElementById(target_area).innerHTML = makehtml(schedule);
		}else{
			// 転記対象フィールドが指定されていなかった場合の処理を書く
		}
	});
});
