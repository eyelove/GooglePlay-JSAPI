var cheerio = require('cheerio');

module.exports = {
  /**
  * Parses the given html to scrap the desired metadata
  *
  * @reference Same API Syntax as iTunes http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html#searchexamples
  *
  * @param String data
  * @return Object
    @prop String icon
    @prop String name
    @prop String description
    @prop String author
    @prop String author_url
    @prop String price
    @prop String primaryGenreName
    @prop String averageUserRating
    @prop String userRatingCount
    @prop Array screenshotUrls
    @prop String viewUrl
    @prop String numDownloads
    @prop String fileSize
    @prop String version
    @prop String supportedDevices
  */
  parse: function(data) {

    $ = cheerio.load(data);
    var r_bundleId = $('body').attr('data-docid');
    var wrapper = $('.details-wrapper ');

    var r_icon = "http:" + wrapper.find(".cover-image").attr("src");
    var r_name = wrapper.find(".document-title[itemprop=name]").text().trim();
    var r_description = wrapper.find("[itemprop=description]").text().trim();
    var r_author = wrapper.find("[itemprop=author] [itemprop=name]").text().trim();
    var r_authorURL = wrapper.find(".meta-info .dev-link").attr("href");
    var r_price = wrapper.find("meta[itemprop=price]").attr('content');

    // User rating from 0/5 and reviews amount
    var r_averageUserRating = wrapper.find("meta[itemprop=ratingValue]").attr('content');
    var r_userRatingCount = wrapper.find("meta[itemprop=ratingCount]").attr('content');
    var r_viewUrl = wrapper.find("span[itemprop=offers] meta[itemprop=url]").attr('content');

    // Technical metadata
    var r_primaryGenreName = wrapper.find("[itemprop=genre]").text();
    var r_version = wrapper.find("[itemprop=softwareVersion]").text();

    return {
      title: r_name,
      storeurl: r_viewUrl,
      description: r_description,
      version: null,
      iconurl: r_icon,
      bundle: r_bundleId,
      price: parseInt(r_price),
      author: r_author,
      author_url: r_authorURL,
      rating: (parseFloat(r_averageUserRating).toFixed(1))/1, // string to float convert
      rationcount: parseInt(r_userRatingCount),
      genre: [ r_primaryGenreName ]
    }
  }
}
