console.log('The bot is starting');

var Twit = require ('twit');

var config = require ('./config');
var T = new Twit(config);

var exec = require ('child_process').exec;
var fs = require('fs');

var stream = T.stream('statuses/filter', { track: ['@latostadorabot ?'] })

stream.on('tweet', function (eventMsg) {
  console.log("Yes no event!");
  var name = eventMsg.source.name;
  var screenName = eventMsg.user.screen_name;
  //var id = tweet.id_str;      // conversation thread


  tweetIt();
  
  console.log(screenName + " tweeted");
  // bot.updateStatus('@' + tweet.user.screen_name + ' True that' ,
  //                   {in_reply_to_status_id: tweet.id_str}, callback);
  //           }

  function tweetIt () {

	var cmd = 'vv_bot_reply/vv_bot_reply';
	//var cmd = 'processing-java --sketch=`pwd`/vv_bot_reply --run';
	exec(cmd, processing);

	function processing() {
		var filename = 'export_reply.gif';         //Aquí va la ruta al gif que creó la app
		var params = {
			encoding: 'base64'
		}
		var b64 = fs.readFileSync (filename, params);

		T.post('media/upload', { media_data: b64 }, uploaded);

		function uploaded (err, data, response) {
			//This is where i will tweet!!
			var id = data.media_id_string;
			var r = Math.floor(Math.random()*1000);
			var tweet = {
				status: '@' + screenName,
				media_ids: [id],
				in_reply_to_status_id: eventMsg.id_str
			}
			T.post ('statuses/update', tweet, tweeted);

		}

		function tweeted (err, data, response) {
			if (err) {
				console.log ("Something went wrong!");
			} else {
				console.log ("It worked!");
			}
		}
	}
}



})


