
module.exports = function(engine) {
  engine.on( /^(?:hello|what is|hey|hi|yo|who is)?\s?@bootler#\d+[\s\.\?\!]*$/i, function(message, params, send) {
    send("Hi, I'm a dumb bot! [Make me smarter](https://github.com/xori/bootler)");
  });

  engine.respond( /--version$/i, function(m, p, send) {
    let pack = require('../package.json');
    let d = engine.config.bootup;
    send(pack.version + " " +
      d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes());
  });

  engine.respond(/status(?: of)?\s?(.*)/i, function(m,p, send) {
    send("https://app.wercker.com/status/3e11407d5a86d397f9a520f2df3297cb/m/" + p[1]);
  });
}

module.exports.test = function(engine) {
  describe('Hello Plugin', function() {
    it('should say hi', function(done) {
      engine.test('hi @bootler#1234', function(text) { done() })
    })
    it('should respond to hey', function(done) {
      engine.test('Hey @Bootler#1234', function(text) { done() })
    })
    it('should respond to confusion', function(done) {
      engine.test('@Bootler#1234 ?', function(text) { done() })
    })
  })
}
