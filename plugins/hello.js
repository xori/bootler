
function pickone(options) {
  const i = Math.floor(Math.random() * options.length)
  return options[i]
}

module.exports = function(engine) {
  engine.respond(/^(?:hello|what is|sup|hey|hi|yo|who is)/i, function(message, params, send) {
    send(pickone([
      "Hi, I'm a dumb bot!",
      "Nice to see you! <3",
      "Hi. How are you doing?",
      "Rise and shine, it's time for wine!",
      "It *is* a good day to be alive",
      "Hi, Handsome! How'd you sleep?",
      "Morning comes whether you set the alarm or not",
      "G'day mate!",
      "Every day is a success if you give !!!MAXIMUM EFFORT!!!",
      "Rise and wine, it's time for *hic* Oh God"
    ]));
  });

  engine.on( /^--version$/i, function(m, p, send) {
    let pack = require('../package.json');
    let d = engine.config.bootup;
    send(pack.version + " " +
      d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes());
  });
}

module.exports.test = function(engine) {
  describe('Hello Plugin', function() {
    it('should say hi', function(done) {
      engine.test('hi @bootler#1234', function(text) { done() }, {
        mentioned: true
      })
    })
    it('should respond to hey', function(done) {
      engine.test('Hey @Bootler#1234', function(text) { done() }, {
        mentioned: true
      })
    })
  })
}
