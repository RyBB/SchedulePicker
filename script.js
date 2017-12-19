chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

	// 現在フォーカスが与えられている要素を取得する
	let active_element = document.activeElement;
	const ajaxURL = 'https://bozuman.cybozu.com/g/schedule/ajax_event_list.csp';
	const memberdata = '{"id":"' + 1788 + '","type":"user","selected":true,"colorId":"0"}';
	let date = new Date();

	// 通常予定
	var getNormalSche = function(input){
		var date = new Date(input.value);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var time = hour + ":" + minute;
		// console.log(time);
		return time;
	};
	// 繰り返し予定
	var getRepeatSche = function(input){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		// console.log(input.value);
		return input.value;
	}
	// 帯予定
	var getRepeatSche = function(input){
		// console.log(input.value);
		return input.value;
	};
	getSchedule(date).done(function (xml) {
		var schedule = new Object();
		var index = 0;
		$(xml).find("schedule_event").each(function () {
			schedule[index] = new Object();
			schedule[index].id = $(this).attr("id");
			schedule[index].event_type = $(this).attr("event_type");
			schedule[index].public_type = $(this).attr("public_type");
			schedule[index].plan = $(this).attr("plan");
			schedule[index].detail = $(this).attr("detail");
			schedule[index].version = $(this).attr("version");
			schedule[index].all_day = $(this).attr("allday");
			schedule[index].start_only = $(this).attr("start_only");
			switch (schedule[index].event_type){
				case "normal":
					console.log("通常予定です。")
					var value = $(this).children().children("datetime")[0].attributes;
					schedule[index].start_time = getNormalSche(value["start"]);
					schedule[index].end_time = getNormalSche(value["end"]);
					console.log(schedule[index].start_time)
					console.log(schedule[index].end_time);
					return;
				case "repeat":
					console.log("繰り返し予定です。");
					var value = $(this).children().children("condition")[0].attributes;
					schedule[index].start_time = getRepeatSche(value["start_time"]);
					schedule[index].end_time = getRepeatSche(value["end_time"]);
					console.log(schedule[index].start_time);
					console.log(schedule[index].end_time);
					return;
				case "banner":
					console.log("帯予定です。");
					var value = $(this).children().children("date")[0].attributes;
					schedule[index].start_time = null;
					schedule[index].end_time = null;
					console.log(schedule[index].start_time);
					console.log(schedule[index].end_time);
					console.log(schedule[index].detail);
					return;
			}
			index = index + 1;
		});
		console.log("----------------------------------------------------");
		console.log(schedule);
		console.log("----------------------------------------------------");

		let target_area = active_element.id;
		if (target_area != null) {
			document.getElementById(target_area).innerHTML = make_text(schedule);
		}
	});

	const data = {
		begin_date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		number_of_days: "1",
		uid: "",
		gid: "selected",
		selected_group_type: "",
		"members[]": memberdata,
		referer_key: "81185dc4a58cf5dbcf1532133cb6d851",
		use_ajax: "1"
	}

	/*$.ajax({
		url: ajaxURL,
		method: "POST",
		dataType: "mp4",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		headers: {
			"X-Requested-With": "XMLHttpRequest",
			"Cache-Control": "no-cache"
		},
		data: data
	}).done(function (result) {
		let target_area = active_element.id;
		if (target_area != null) {
			document.getElementById(target_area).innerHTML = make_text_from_schedule(result);
		}
	}).fail(function (result) {
		console.log("4-2!");
		console.log(result.members);
	});;*/
});

function make_text(schedule) {
	var text = '<div class="user-token-listTime" style="line-height: 1.2;white-space: nowrap;font-size: 13.68px;">'

	text = text + '<div class="user-token-share user-token-normalEventElement   user-token-group_week_calendar_item" style="margin: 0.0px 1.0px 7.0px 3.0px;font-size: 13.68px;">'
	text = text + "<div>【今日の予定】</div>"

	schedule.forEach(function (element) {
		text = text + "<div>"
		text = text + pick_date(element.start_date) + "-" + pick_date(element.end_date) + " ";
		text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.detail + "</a>";
		text = text + "</div>"
	}, this);
	text = text + "</div>"
	return text;
}



function make_text_from_schedule(result) {
	var text = '<div class="user-token-listTime" style="line-height: 1.2;white-space: nowrap;font-size: 13.68px;">'

	text = text + '<div class="user-token-share user-token-normalEventElement   user-token-group_week_calendar_item" style="margin: 0.0px 1.0px 7.0px 3.0px;font-size: 13.68px;">'
	text = text + "<div>【今日の予定】</div>"

	result.events.by_date[0].events.normal.forEach(function (element) {
		text = text + "<div>"
		text = text + pick_date(element.start_date) + "-" + pick_date(element.end_date) + " ";
		text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.detail + "</a>";
		text = text + "</div>"
	}, this);
	text = text + "</div>"
	return text;
}

function pick_date(date) {
	var hour = date.split(" ")[1].split(":")[0];
	var minute = date.split(" ")[1].split(":")[1];
	return "" + hour + minute;
}

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
	data += '      <parameters start="' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T00:00:00" + '" end="' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T23:59:00" + '"> </parameters>';
	data += '    </ScheduleGetEvents>';
	data += '  </soap:Body>';
	data += '</soap:Envelope>';

	return $.ajax({
		method: 'POST',
		url: '/g/cbpapi/schedule/api?',
		data: data,
		dataType: 'xml',
		contentType: 'text/xml'
	});
}