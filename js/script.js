chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	chrome.storage.sync.get(null, function (items) {

		// 現在フォーカスが与えられている要素を取得する
		let active_element = document.activeElement;
		// let date = new Date;
		let date = moment();
		let today = date.format("YYYY-MM-DD");
		let tomorrow = moment(today).add(1, 'd').format("YYYY-MM-DD");
		let selected_date = items.select;
		if ( request === "Today"){}
		else if (request === "Tomorrow"){date = moment(today).add(1, 'd')}
		else {date = moment(selected_date);}
		getSchedule(date, request).done(function (xml) {
			var schedule = new Array();
			schedule = formatSchedule($(xml));
			type = items.secret;

			let target_area = active_element.id;
			if (target_area != "") {
				console.log(document.getElementById(target_area));
				if (request == "Today") {
					document.getElementById(target_area).innerHTML = document.getElementById(target_area).innerHTML + makehtml(schedule, type, today);
				} else if (request == "Tomorrow") {
					document.getElementById(target_area).innerHTML = document.getElementById(target_area).innerHTML + makehtml(schedule, type, tomorrow);
				} else {
					document.getElementById(target_area).innerHTML = document.getElementById(target_area).innerHTML + makehtml(schedule, type, selected_date);
				}
			} else {
				// 転記対象フィールドが指定されていなかった場合の処理を書く
			}
		});
	});
});

function getSchedule(date, request) {
	// day_count = 0;
	// if (request == "Today") {
	// 	day_count = 0;
	// } else if (request == "Tomorrow") {
	// 	day_count = 1;
	// } else {
	// 	 = 0;
	// }

	var data = '<?xml version="1.0" encoding="UTF-8"?>';
	data += '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">';
	data += '  <soap:Header>';
	data += '    <Action>';
	data += 'ScheduleGetEvents';
	data += '    </Action>';
	data += '    <Security>';
	// 更新系のAPIはリクエストトークンもしくはアカウント、パスワードの指定が必要です。
	// https://cybozudev.zendesk.com/hc/ja/articles/202228464#step8
	//
	// リクエストトークンの必要なAPIの一覧はこちらです。
	// https://cybozudev.zendesk.com/hc/ja/articles/202686190
	//
	// 今回はスケジュールの取得なので不要です。
	data += '      <UsernameToken>';
	data += '        <Username></Username>';
	data += '        <Password></Password>';
	data += '      </UsernameToken>';
	data += '    </Security>';
	data += '    <Timestamp>';
	data += '      <Created>2010-08-12T14:45:00Z</Created>';
	data += '      <Expires>2037-08-12T14:45:00Z</Expires>';
	data += '    </Timestamp>';
	data += '    <Locale>jp</Locale>';
	data += '  </soap:Header>';
	data += '  <soap:Body>';
	data += '    <ScheduleGetEvents>';
	data += '      <parameters start="' + date.year() + "-" + (date.month() + 1) + "-" + date.date() + "T00:00:00" +
		'" end="' + date.year() + "-" + (date.month() + 1) + "-" + date.date() + "T23:59:00" +
		'" start_for_daily="' + date.year() + "-" + (date.month() + 1) + "-" + date.date() +
		'" end_for_daily="' + date.year() + "-" + (date.month() + 1) + "-" + date.date() + '"> </parameters>';
	data += '    </ScheduleGetEvents>';
	data += '  </soap:Body>';
	data += '</soap:Envelope>';
	console.log(date.month());
	return $.ajax({
		method: 'POST',
		url: '/g/cbpapi/schedule/api?',
		data: data,
		dataType: 'xml',
		contentType: 'text/xml'
	});
}