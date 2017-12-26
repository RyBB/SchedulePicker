function makehtml(schedule, type, date) {
	var html_text = ''
	//html_text += '<div class="user-token-listTime" style="line-height: 1.2;white-space: nowrap;font-size: 13.68px;">'
	//html_text += '<div class="user-token-share user-token-normalEventElement   user-token-group_week_calendar_item" style="margin: 0.0px 1.0px 7.0px 3.0px;font-size: 13.68px;">'
	html_text += "<div>【" + date + "】の予定</div>"
	schedule.forEach(function (element) {

		text = "";
		switch (element.event_type) {
			case "repeat":
				{
					if (element.public_type === "private") {
						if (type === true) {
							break;
						}
					}
					text = text + '<div class="listTime" style="line-height: 1.2; white-space: nowrap;">'
					if (element.all_day == "true") {
						text = text + set_plan("終日");
					} else if (element.end_time == undefined) {
						text = text + element.start_time + " ";
					} else {
						text = text + element.start_time + "-" + element.end_time + " ";
					}
					if (element.plan != undefined) {
						text = text + set_plan(element.plan);
					}
					text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.detail + "</a>";
					text = text + '<img src="https://static.cybozu.com/g/F12.0.395_7.11/grn/image/cybozu/repeat16.gif?20171204.text" border="0" style="vertical-align: -3px;">';
					text = text + "</div>"
					break;
				}
			case "normal":
				{
					if (element.public_type === "private") {
						if (type === true) {
							break;
						}
					}
					text = text + '<div class="listTime" style="line-height: 1.2; white-space: nowrap;">'
					if (element.all_day == "true") {
						text = text + set_plan("終日");
					} else if (element.end_time == undefined) {
						text = text + element.start_time + " ";
					} else {
						text = text + element.start_time + "-" + element.end_time + " ";
					}
					if (element.plan != undefined) {
						text = text + set_plan(element.plan);
					}
					text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.detail + "</a>";
					text = text + "</div>"
					break;
				}
			case "banner":
				{}
				//帯予定についての処理を書く
				break;
		}
		html_text = html_text + text;
	}, this);
	html_text = html_text + "</div></div>"
	html_text += '<div class="textarea-resize-cybozu"></div>';
	return html_text;
}

function set_plan(plan) {
	plan_color = plan_list(plan);

	plan_text = '<span class="event_color1_grn" style="background-color: rgb(' +
		plan_color.r + ',' + plan_color.g + ',' + plan_color.b +
		'); display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">'
	plan_text += plan + '</span>';
	return plan_text;
}

function plan_list(plan) {
	plan_color = new Object();
	plan_color.r = 49;
	plan_color.g = 130;
	plan_color.b = 220;
	switch (plan) {
		//青
		case "打合":
		case "会議":
			plan_color.r = 49;
			plan_color.g = 130;
			plan_color.b = 220;
			break;
			//水色
		case "来訪":
		case "取材/講演":
		case "【履歴】来訪":
			plan_color.r = 87;
			plan_color.g = 179;
			plan_color.b = 237;
			break;
			//オレンジ
		case "出張":
		case "ウルトラワーク":
			plan_color.r = 239;
			plan_color.g = 146;
			plan_color.b = 1;
			break;
			//赤
		case "副業":
		case "休み":
			plan_color.r = 244;
			plan_color.g = 72;
			plan_color.b = 72;
			break;
			//ピンク
		case "往訪":
		case "【履歴】往訪":
			plan_color.r = 241;
			plan_color.g = 148;
			plan_color.b = 167;
			break;
			//紫
		case "面接":
		case "フェア":
			plan_color.r = 181;
			plan_color.g = 146;
			plan_color.b = 216;
			break;
			//茶色
		case "勉強会":
		case "タスク":
			plan_color.r = 185;
			plan_color.g = 153;
			plan_color.b = 118;
			break;
			//黒
		case "説明会":
		case "セミナー":
		case "その他":
			plan_color.r = 153;
			plan_color.g = 153;
			plan_color.b = 153;
			break;
			//黒
		case "終日":
			plan_color.r = 50;
			plan_color.g = 205;
			plan_color.b = 50;
			break;
	}
	return plan_color;
}



function makehtml2(schedule) {
	let date = new Date();
	var html_text = ''
	html_text += "<div>【今日の予定】</div>"

	schedule.forEach(function (element) {
		text = "";
		text += '<div class="normal normalEventElement   group_week_calendar_item" style="margin: 0px 1px 12px 3px; font-size: 13.68px; color: rgb(34, 34, 34); font-family: &quot;ヒラギノ角ゴ ProN W3&quot;, &quot;Hiragino Kaku Gothic ProN&quot;, メイリオ, Meiryo, &quot;MS PGothic&quot;, &quot;ＭＳ Ｐゴシック&quot;, sans-serif;">'
		switch (element.event_type) {
			case "repeat":
				text = text + '<div class="listTime" style="line-height: 1.2; white-space: nowrap;">'
				if (element.plan != undefined) {
					text = text + set_plan(element.plan);
				}
				text = text + element.start_time + "-" + element.end_time + " ";
				text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.detail + "</a>";
				text = text + '<img src="https://static.cybozu.com/g/F12.0.395_7.11/grn/image/cybozu/repeat16.gif?20171204.text" border="0" style="vertical-align: -3px;">';
				text = text + "</div>"
				break;
			case "normal":
				text = text + '<div class="listTime" style="line-height: 1.2; white-space: nowrap;">'
				if (element.plan != undefined) {
					text = text + set_plan(element.plan);
				}
				if (element.start_time != undefined) {
					text = text + element.start_time + "-" + element.end_time + " ";
				} else {
					text = text + "終日予定 "; //TODO: 要検討
				}
				text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.detail + "</a>";
				text = text + "</div>"
				break;
			case "banner":
				//帯予定についての処理を書く
				break;
		}
		html_text = html_text + text;
	}, this);
	//html_text = html_text + "</div>"
	html_text += '<div class="textarea-resize-cybozu"></div>';
	return html_text;
}