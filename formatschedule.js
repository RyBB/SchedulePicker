
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
	});