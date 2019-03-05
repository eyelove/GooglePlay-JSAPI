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
    var wrapper = $('body');

    var icon2x = wrapper.find("img[itemprop=image]").attr('srcset');
    var r_icon = icon2x.substring(0, icon2x.indexOf(" "));
    var r_name = wrapper.find("h1[itemprop=name]").find("span").text().trim();
    var r_description = $("meta[name=description]").attr("content").trim();
    var r_author = wrapper.find("a.hrTbp.R8zArc").filter("[itemprop!=genre]").text().trim();
    var r_authorURL = wrapper.find(".meta-info .dev-link").attr("href");
    var price_text = wrapper.find("meta[itemprop=price]").attr('content');
    var r_price = 0;
    if (price_text) {
      r_price = price_text.replace(/[,₩]/g, '');
    }

    // User rating from 0/5 and reviews amount
    var r_averageUserRating = wrapper.find("meta[itemprop=ratingValue]").attr('content');
    var r_userRatingCount = wrapper.find("meta[itemprop=reviewCount]").attr('content');
    var r_viewUrl = $("link[rel=canonical]").attr('href');
    var r_downloads = wrapper.find("div.hAyfc").eq(2).find("span").last().text();
    var downloads = [0, r_downloads.replace(/[,+]/g, '')];

    // Technical metadata
    var r_primaryGenreName = wrapper.find("[itemprop=genre]").text();
    var r_version = wrapper.find("div.hAyfc").eq(3).find("span").last().text();

    return {
      title: r_name,
      storeurl: r_viewUrl,
      description: r_description,
      version: r_version,
      iconurl: r_icon,
      bundle: r_bundleId,
      price: parseInt(r_price),
      author: r_author,
      author_url: r_authorURL,
      rating: (parseFloat(r_averageUserRating).toFixed(1))/1, // string to float convert
      ratingcount: parseInt(r_userRatingCount),
      genre: r_primaryGenreName,
      download_min: downloads[0],
      download_max: downloads[1]
    }
  }
}
