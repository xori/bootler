const request = require('request');

module.exports = function(engine) {
  let apikey = process.env.GOOGLE_API || require('../config.js').google_api

  engine.on( /^(?:who|what) is (.+)\?$/i, function(message, params, send) {
    let search = params[1];
    let url = "https://kgsearch.googleapis.com/v1/entities:search?query={query}&key={key}&limit=1&indent=True";
    request.get(url.replace("{query}", search).replace("{key}", apikey),
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          if(data.itemListElement.length > 0) {
            console.log(data);
            let entry = data.itemListElement[0].result;
            let description = entry.detailedDescription && entry.detailedDescription.articleBody ? entry.detailedDescription.articleBody : entry.description;
            let image = entry.image && entry.image.contentUrl ? entry.image.contentUrl : entry.url;
            let result = `**${entry.name}**\n${image || ""}\n${description}`
            send(result);
          }
        }
    });
  });
}
