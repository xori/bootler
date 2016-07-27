
module.exports = function(engine) {
  engine.on( /^(?:hello|what is|hey|hi|yo|who is)?\s?@bootler#\d+[\s\.\?\!]*$/i, function(message, params, send) {
    send("Hi, I'm a dumb bot! [Make me smarter](https://github.com/xori/bootler)");
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
