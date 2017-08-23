module.exports = {
	/**
	* Parses the given html to scrap the desired metadata
	*
	* @reference Same API Syntax as iTunes http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html#searchexamples
	*
	* @param String data
	* @return Object
		@prop String title
		@prop String description
		@prop String storeurl
		@prop String version
		@prop String iconurl
		@prop String bundle
		@prop String price
		@prop String rating
		@prop String rationcount
		@prop String genre
    @prop String author
    @prop String author_url
	*/
	parse: function(data) {

		var res = JSON.parse(data);

		if (res.results.length>0) {
			var r = res.results[0];
			
			var genres = r.genres;
			genres.forEach(function(value, index){
				genres[index] = value.trim();
			});

			return {
				title: r.trackName,
				storeurl: r.trackViewUrl,
				description: r.description,
				version: r.version,
				iconurl: r.artworkUrl512,
				bundle: r.bundleId,
				price: r.price,
				author: r.sellerName,
				author_url: r.sellerUrl,
				rating: r.averageUserRating,
				ratingcount: r.userRatingCount,
				genre: genres.join('/')
			}
		} else {
			return {
				"error": 404
			};
		}
	}
}
