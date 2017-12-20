chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

	// 現在フォーカスが与えられている要素を取得する
	let active_element = document.activeElement;
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
		var schedule = new Array();
		var index = 0;
		console.log($(xml));
		$(xml).find("schedule_event").each(function () {
			console.log($(this));
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
					if($(this).children().children("datetime")[0] == undefined)break;
					var value = $(this).children().children("datetime")[0].attributes;
					schedule[index].start_time = getNormalSche(value["start"]);
					schedule[index].end_time = getNormalSche(value["end"]);
					console.log(schedule[index].start_time)
					console.log(schedule[index].end_time);
					break;
				case "repeat":
					console.log("繰り返し予定です。");
					var value = $(this).children().children("condition")[0].attributes;
					schedule[index].start_time = getRepeatSche(value["start_time"]);
					schedule[index].end_time = getRepeatSche(value["end_time"]);
					console.log(schedule[index].start_time);
					console.log(schedule[index].end_time);
					break;
				case "banner":
					console.log("帯予定です。");
					var value = $(this).children().children("date")[0].attributes;
					schedule[index].start_time = null;
					schedule[index].end_time = null;
					console.log(schedule[index].start_time);
					console.log(schedule[index].end_time);
					console.log(schedule[index].detail);
					break;
			}
			index = index + 1;
		});
		console.log("----------------------------------------------------");
		console.log(schedule);
		console.log("date:"+date.getDate() );
		console.log("----------------------------------------------------");

		let target_area = active_element.id;
		if (target_area != "") {
			console.log(schedule);
			document.getElementById(target_area).innerHTML = make_text(schedule);
		}else{
			// 転記対象フィールドが指定されていなかった場合の処理を書く
		}
	});
});

function make_text(schedule) {
	var html_text = '<div class="user-token-listTime" style="line-height: 1.2;white-space: nowrap;font-size: 13.68px;">'
	html_text = html_text + '<div class="user-token-share user-token-normalEventElement   user-token-group_week_calendar_item" style="margin: 0.0px 1.0px 7.0px 3.0px;font-size: 13.68px;">'
	html_text = html_text + "<div>【今日の予定】</div>"

	schedule.forEach(function (element) {
		text = "";
		console.log(element);
		switch(element.event_type){
			case "repeat":
				text = text + '<div class="listTime" style="line-height: 1.2; white-space: nowrap;">'
				if(element.plan != undefined){
					text = text + set_plan(element.plan);
			  }
				text = text + element.start_time + "-" + element.end_time + " "; 
				text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.detail + "</a>";
				text = text + '<img src="https://static.cybozu.com/g/F12.0.395_7.11/grn/image/cybozu/repeat16.gif?20171204.text" border="0" style="vertical-align: -3px;">';
				text = text + "</div>"
			break;
			case "normal":
				text = text + '<div class="listTime" style="line-height: 1.2; white-space: nowrap;">'
			  if(element.plan != undefined){
					text = text + set_plan(element.plan);
			  }
				text = text + element.start_time + "-" + element.end_time + " "; 
				text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.detail + "</a>";
				text = text + "</div>"
			break;
			case "banner":
			//帯予定についての処理を書く
			break;
		}
		html_text = html_text + text;
	}, this);
	html_text = html_text + "</div></div>"
	console.log(html_text);
	return html_text;
}

function set_plan(plan){
	plan_color = plan_list(plan);

	plan_text = '<span class="event_color1_grn" style="background-color: rgb('
	 + plan_color.r + ',' + plan_color.g + ',' + plan_color.b 
	 + '); display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">'
	plan_text = plan_text + plan + '</span>';
	return plan_text;
}

function plan_list(plan){
	plan_color = new Object();
	plan_color.r = 49;plan_color.g = 130;plan_color.b = 220;
	switch(plan){
		//青
		case "打合":
		case "会議":
		plan_color.r = 49;plan_color.g = 130;plan_color.b = 220;
		break;
		//水色
		case "来訪":
		case "取材/講演":
		case "【履歴】来訪":
		plan_color.r = 87;plan_color.g = 179;plan_color.b = 237;
		break;
		//オレンジ
		case "出張":
		case "ウルトラワーク":
		plan_color.r = 239;plan_color.g = 146;plan_color.b = 1;
		break;
		//赤
		case "副業":
		case "休み":
		plan_color.r = 244;plan_color.g = 72;plan_color.b = 72;
		break;
		//ピンク
		case "往訪":
		case "【履歴】往訪":
		plan_color.r = 241;plan_color.g = 148;plan_color.b = 167;
		break;
		//紫
		case "面接":
		case "フェア":
		plan_color.r = 181;plan_color.g = 146;plan_color.b = 216;
		break;
		//茶色
		case "勉強会":
		case "タスク":
		plan_color.r = 185;plan_color.g = 153;plan_color.b = 118;
		break;
		//黒
		case "説明会":
		case "セミナー":
		case "その他":
		plan_color.r = 153;plan_color.g = 153;plan_color.b = 153;
		break;
	}
	return plan_color;
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
