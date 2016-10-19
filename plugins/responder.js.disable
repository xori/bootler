/*
@Bootler when someone says "Genji" say "Nobody likes the ninja."

@Bootler sayings --list
@Bootler sayings --rm 5

*/

module.exports = function(engine) {
  var quips = engine.brain("quips") || {};
  engine.brain("quips", quips);

  engine.on(/^(.+)$/, function(message, params, send) {
    if(message.mentions.length > 0 && message.mentions[0].bot) return; // skip @Bootler msgs
    if(message.author.bot) return;
    for(let key in quips) {
      let regex = new RegExp(key, "i");
      var match = params[1].match(regex);
      if(match) send(quips[key].replace(/\$1/g, match[1]));
    }
  });

  engine.respond(/when someone says "(.*)" say "(.*)"$/i, function(m, p, send) {
    if(!p[1] || !p[2]) return send("need to provide all the parameters.");
    quips = engine.brain("quips");
    try {
      new RegExp(p[1], 'i'); // test that it compiles
      quips[p[1]] = p[2];
      engine.brain("quips", quips);
      send(`Ok, when someone says ${p[1]} I'll respond with ${p[2]}`);
    } catch(e) {
      send('Not a valid regex :/')
    }
  });

  engine.respond(/sayings --list/i, function(m,p, send) {
    quips = engine.brain("quips");
    let response = "";
    for(let key in quips) {
      response += `${key}\n`;
    }
    if(response == "") {
      send("No sayings set");
    } else {
      send(response);
    }
  });

  engine.respond(/sayings --rm (.+)$/i, function(m,p, send) {
    send(`Removing "${p[1]}"`)
    quips = engine.brain("quips");
    delete quips[p[1]];
    engine.brain('quips', quips);
  });
}

module.exports.test = function(engine) {
  describe('Response Plugin', function() {
    this.slow(500);
    it('should add sayings', function(done) {
      engine.test('@bot when someone says "f[o]{2}$" say "bar"', function(text) { done() })
    })
    it('should respond to sayings', function(done) {
      engine.test('what the foo', function(text) { done() }, { author: { bot: false } })
    })
    it('should remove sayings', function(done) {
      engine.test('@bot sayings --rm f[o]{2}$', function(text) {})
      engine.test('what the foo', function(text) {
        throw new Error("shouldn't have responded.");
      }, { author: { bot: false } })
      done()
    })
  })
}
