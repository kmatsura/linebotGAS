var CHANNEL_ACCESS_TOKEN = YOURLINETOKEN;
var USER_ID = YOURLINEID;

// 通知機能
function push_message() {
  var today = new Date();
  var toWeekday = toWD(today);
  var msgWeatherForecast = getTemperatureForecast();
  var msgAniversary = getAniversary(today);
  
  var postData = {
    "to": USER_ID,
    "messages": [
      {
        "type": "text",
        "text": "おはぬん！今日は、" +Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy年M月d日') + toWeekday + "だぬ！\n"
                + msgWeatherForecast[0] + msgWeatherForecast[1] + msgWeatherForecast[2] + msgWeatherForecast[3]
                + msgAniversary
      }
    ]}
  
  var headers = {
    "Content-Type": "application/json",
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  };
  
  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };
  
  var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", options);
  
}

// 天気予報の取得 
function getTemperatureForecast() {
  const area = "東京地方"
  var options =
      {
        "contentType" : "text/xml;charset=utf-8",
        "method" : "get",
      };
  var response = UrlFetchApp.fetch("https://www.drk7.jp/weather/xml/13.xml", options); 
  var xmlDoc = XmlService.parse(response.getContentText());
  var rootDoc = xmlDoc.getRootElement();
  var region = parser.getElementById(rootDoc,area);
  var weather = parser.getElementsByTagName(region, 'weather');
  var temperature = parser.getElementsByTagName(region, 'range');
  var rainyPercent = parser.getElementsByTagName(region, 'period');
  var weathermsg = "■天気予報：" + area + "\n" + weather[0].getValue() + "\n"
  var tempmsg ="■気温\n" + temperature[0].getValue() + "℃/" + temperature[1].getValue() + "℃\n";
  var rainmsg = "■降水確率\n" + "朝: " + rainyPercent[1].getValue() + "%, 昼: " + rainyPercent[2].getValue() + "%, 夜: " + rainyPercent[3].getValue() + "%\n";
  var umbrellamsg = "■傘予想\n" + getUmbrellNecessary(rainyPercent[1].getValue(),rainyPercent[2].getValue(),rainyPercent[3].getValue());
  var rainyTemperature = [weathermsg,tempmsg,rainmsg,umbrellamsg];
  return rainyTemperature
}

// 傘予想
function getUmbrellNecessary(mor,eve,nig){
  var msg = ""
  if (mor < 20 && eve < 20 && nig < 20 ) {
    msg = "傘はいらないの";
  }
  else if (mor < 50 && eve < 50 && nig < 50 ) {
    msg = "折りたたみ傘があると安心だぬ〜！";
  }
  else {
    msg = "傘を持って行ったほうがいいぬん！";
  }
  return msg
}

//　曜日の日本語変換
function toWD(date){
  var myTbl = new Array("日","月","火","水","木","金","土","日"); 
  var myDay = Utilities.formatDate(date, "JST", "u");
  return "(" + myTbl[myDay] + ")";
}

//記念日
function getAniversary(today){
  var year = today.getFullYear() - 1945;
  var month = today.getMonth() - 8;
  var date = today.getDate() - 15;
  var aniv = new Date("1945/08/15");
  var count = Math.floor((today - aniv) / 86400000);
  var msg = "\n■日付\n今日は終戦から" + count + "日目だぬ！";
    if (date == 0){
      msg += "\nおめでとお！今日は" + 12*year+month +"ヶ月記念日だぬ！";
      } else {
      msg += "";
      }
  if (count % 100 == 0) {
      msg += "\nおめでとお！今日は" + count +"日記念日だぬ！";
      } else {
      msg += "";
      }
  return msg
}