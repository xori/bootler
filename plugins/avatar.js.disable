const request = require('request').defaults({ encoding: null });

module.exports = function(engine) {
  engine.respond( /(?:you should )?change your avatar to (http.+)$/i, function(message, params, send) {
    let url = params[1];
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          engine.client.setAvatar("data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64'), engine.report);
          send("avatar set");
        } else {
          send(`Had some trouble getting that file. Status ${response.statusCode}\n${error}`);
        }
    });
  });
}
