var extractor = require("unfluff");

var express = require('express');
var bodyParser = require('body-parser');

var request = require('request');

var app = express();

var SummaryTool = require('node-summary');
var summary = require('node-tldr');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/', function(req, res){
	console.log("POST");

	var url1 = req.body.url;
	console.log("URL " + url1);
	var textData = extractor(url1);
	console.log("text: " + textData.text);

	var options = {
		url: "http://api.diffbot.com/v3/article",
		method: "GET",
		qs:{
			"token":"49fd2f787c96ab7feb454c68ec1cd36a",
			"url":addSlashes(url1),
			"discussion":"false"
		}
	};

	request(options, function(error, response, body){
		
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			//console.log("json data: " + data);
			// console.log("body: " + body);
			// console.log("text of article: " + data["objects"] + Array.isArray(data["objects"]));
			// console.log("type: " + Array.isArray(body) + "\t --" + Array.isArray(data));

			var tempArray = data["objects"][0];
			// console.log('length: ' + data["objects"].length);
			// console.log(tempArray["text"]);
			// console.log(tempArray);
			console.log("img url: " + tempArray["images"][0]["url"]);


		}




		var dataArray = {};
		dataArray["data"] = 123;
		dataArray["url"] = url1;
		var json = JSON.stringify(dataArray);

		// res.type("json");
		// res.send(body);

		console.log("END POST BLOCK");
	});

	summary.summarize(url1, function(result, failure) {
    if (failure) {
        console.log("An error occured! " + result.error);
    }

    console.log("------------------------------------------------------------------------")
    console.log(result.title);
    console.log(result.words);
    console.log(result.compressFactor);
    console.log(result.summary.join("\n").replace(/(\r\n|\n|\r)/gm,""));
    console.log("------------------------------------------------------------------------")

	var json = JSON.stringify({"summary" : result.summary.join("\n").replace(/(\r\n|\n|\r)/gm,"")});

	res.type("json");
	res.send(json);

});


	//res.send("ERROR");
});


app.get('/', function (req, res) {
	res.send('Hello World!');
	console.log("GET");



});


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});


function addSlashes( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}
