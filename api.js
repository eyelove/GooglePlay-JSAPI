var request = require('request');

module.exports = {
	/**
	* Retrieves information with a given apple appstore
	*
	* @param Object config
		* @prop String appID
	* @param Object config
		* @prop String country
	* @param Function callback
		* @param Object data
	*/
	getApp: function (config, callback) {
		var basePath = "https://itunes.apple.com/lookup?id=";

		request(basePath+config.appID+"&country="+config.country, function (error, res, chunk) {
			if (!error && res.statusCode == 200) {
				var scraper = require('./scrapers/app');
				try {
					var data = scraper.parse(chunk);
					if (typeof callback == 'function') {
						callback(JSON.stringify(data));
					}
				} catch(error) {
					// call callback anyway
					callback(JSON.stringify({
						error: 500
					}));
				}
			} else {
				// call callback anyway
				callback(JSON.stringify({
					error: res.statusCode
				}));
			}
		});
	},
	/**
	* Retrieves information with a given google playstore
	*
	* @param Object config
		* @prop String appID
	* @param Function callback
		* @param Object data
	*/
	getPlay: function (config, callback) {
		var basePath = "https://play.google.com/store/apps/details?id=";

		request(basePath + config.appID +"&hl=ko", function (error, res, chunk) {
			if (!error && res.statusCode == 200) {
				var scraper = require('./scrapers/play');
				try {
					var data = scraper.parse(chunk);
					if (typeof callback == 'function') {
						callback(JSON.stringify(data));
					}
				} catch(error) {
					// call callback anyway
					callback(JSON.stringify({
						error: 500
					}));
				}
			} else {
				// call callback anyway
				callback(JSON.stringify({
					error: res.statusCode
				}));
			}
		});
	},
};
