let request = require('request');

module.exports = function (robot) {
  var url = "http://store.steampowered.com/search/suggest?term={{term}}&f=games&cc=CA&l=english&v=1127612"
  var parse = /match_name">([^<]+)<\/div>.*?CDN&#36; (\d+\.\d+)/gi

  robot.respond(/steam (.+)/i, function (message, params, send) {
    request(url.replace("{{term}}", params[1]), function (err, _, body) {
      if (err) {
        send("Encountered an error :\n" + err);
        return;
      }
      var result = ""
      var results = []
      body.replace(parse, function (str, one, two) {
        results.push({
          title: one,
          price: two
        });
      })
      if (results && results.length > 0) {
        results.forEach(function (i) {
          result += i.title + " - $" + i.price + "\n";
        })
      } else {
        result += "Couldn't find any games called '" + params[1] + "'"
      }
      send(result.trim());
    })
  })

  robot.respond( /what'?s (on sale|featured|on steam)\??$/i, function(message, params, send) {
    request('http://store.steampowered.com/api/featured?cc=CA', function(err, _, body) {
      if(err) {
        send("Encountered an error\n", err);
        return;
      }
      var data = JSON.parse(body);
      var result = "";
      var somethings_on_sale = false;
      data.large_capsules.forEach(function(featured) {
        if(params[1] === 'on sale' && featured.discount_percent === 0) return;
        else somethings_on_sale = true;
        result += featured.name + ' - $' + (featured.final_price / 100.0) +
          ' (' + featured.discount_percent + '%)\n'

      })
      data.featured_win.forEach(function(featured) {
        if(params[1] === 'on sale' && featured.discount_percent === 0) return;
        else somethings_on_sale = true;
        result += featured.name + ' - $' + (featured.final_price / 100.0) +
          ' (' + featured.discount_percent + '%)\n'
      })
      if(!somethings_on_sale && params[1] === 'on sale') {
          result += "Nothing featured is on sale."
      }
      send(result.trim());
    });
  })

}

module.exports.test = function(engine) {
  describe('Steam Plugin', function() {
    it("checks sales", function(done) {
      engine.test('@bot whats on steam', function(text) {
        assert(text.length > 0);
        done();
      })
    })
    it("searches games", function(done) {
      engine.test('@bot steam overcooked', function(text) {
        assert(text.length > 0);
        done();
      })
    })
  })
}
