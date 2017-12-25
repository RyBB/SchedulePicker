var formatSchedule = function (xml) {

    // 通常予定の日時処理
    var getNormalSche = function (input) {
        var date = new Date(input.value);
        var hour = ("0" + date.getHours()).slice(-2);
        var minute = ("0" + date.getMinutes()).slice(-2);
        var time = hour + ":" + minute;
        // 以下、日付部分(今後機能追加で使うかも)
        // var year = date.getFullYear();
        // var month = ("0" + (date.getMonth() + 1)).slice(-2);
        // var day = ("0" + date.getDate()).slice(-2)
        return time;
    };
    // 繰り返し予定の日時処理
    var getRepeatSche = function (input) {
        return input.value.slice(0, -3);
        // 以下、日付部分(今後機能追加で使うかも)
        // var date = new Date();
        // var year = date.getFullYear();
        // var month = date.getMonth() + 1;
        // var day = date.getDate();
    };
    // スケジュールのタイプが通常/繰り返し/帯で分岐させる
    var checkScheduleType = function (array, count) {
        switch (array.event_type) {
            case "normal":
                {
                    var value = count.children().children("datetime")[0];
                    //終日予定の場合の分岐
                    if (value === undefined) {
                        array.start_time = undefined;
                        array.end_time = undefined;
                        break;
                    }
                    //開始時刻のみ記入されている場合 = start_onry
                    if (value.attributes["end"] === undefined) {
                        array.start_time = getNormalSche(value.attributes["start"]);
                        array.end_time = undefined;
                        break;
                    }
                    // 普通の通常予定の場合
                    array.start_time = getNormalSche(value.attributes["start"]);
                    array.end_time = getNormalSche(value.attributes["end"]);
                    break;
                }
            case "repeat":
                {
                    var value = count.children().children("condition")[0];
                    // 繰り返し終日予定の場合
                    if (value.attributes["start_time"] === undefined) {
                        array.start_time = undefined;
                        array.end_time = undefined;
                        return;
                    }
                    array.start_time = getRepeatSche(value.attributes["start_time"]);
                    array.end_time = getRepeatSche(value.attributes["end_time"]);
                    break;
                }
            case "banner":
                {
                    array.start_time = undefined;
                    array.end_time = undefined;
                    break;
                }
        }
    };
    // 文字列比較のためにUndefinedを文字列に変更
    var setUndefined = function (a, b) {
        if (a.start_time === undefined) {
            a.start_time = "undefined";
        }
        if (b.start_time === undefined) {
            b.start_time = "undefined";
        }
    };
    // スケジュールのソート
    var sortTime = function (array) {
        array.sort(function (a, b) {
            setUndefined(a, b);

            // 比較
            if (a.start_time > b.start_time) {
                setUndefined(a, b);
                return 1;
            }
            if (a.start_time < b.start_time) {
                setUndefined(a, b);
                return -1;
            }
            setUndefined(a, b);
            return 0;
        });
        return array;
    };
    // メインの処理
    var setSchedule = function () {
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
            checkScheduleType(schedule[index], $(this))
            index = index + 1;
        });
        return sortTime(schedule);
    }
    return setSchedule();
}