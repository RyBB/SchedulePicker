chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	// 現在フォーカスが与えられている要素を取得する
	let active_element = document.activeElement;

	getSchedule(date).done(function (xml) {
		var schedule = new Array();
		schedule = formatschedule($(xml));

		let target_area = active_element.id;
		if (target_area != "") {
			console.log(schedule);
			document.getElementById(target_area).innerHTML = makehtml(schedule);
		}else{
			// 転記対象フィールドが指定されていなかった場合の処理を書く
		}
	});
});

function getSchedule(date) {
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
	data += '      <parameters start="' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T00:00:00" 
	+ '" end="' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T23:59:00"
	+ '" start_for_daily="' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
	+ '" end_for_daily="' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + '"> </parameters>';
	data += '    </ScheduleGetEvents>';
	data += '  </soap:Body>';
	data += '</soap:Envelope>';

	console.log(data);
	return $.ajax({
		method: 'POST',
		url: '/g/cbpapi/schedule/api?',
		data: data,
		dataType: 'xml',
		contentType: 'text/xml'
	});
}

