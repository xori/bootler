
module.exports = function(engine) {
  engine.on( /^oh.*?oracle/i , function(message, params, send) {
    var manners = !!message.cleanContent.match( /please/i ); // ask nicely
    engine.http({
      url: "https://yesno.wtf/api" + (manners ? "?force=yes" : ""),
      json: true
    }, function(err, res, body) {
      if(err) return console.log(err);
      var oracle = body;
      send(body.image);
    });
  });
}
