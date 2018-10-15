const R = require('roll');

module.exports = function(engine) {
  engine.on(/^roll (.+)$/i, roll);
  
  engine.on(/(^\d+d\d+(?:[\+\-\*\/]\d+)*)/i, roll);
}

function roll(message, params, send) {
	if (message.author.bot){ // Don't get into an infinite loop with yourself
		return;
	}
    let ask = params[1].split(" ");
    let dice = new R();

    let result = "";
    let resultValue = "";
    for(let i = 0; i < ask.length; i++ ) {
      let _ = ask[i].trim();
      if(dice.validate(_)) {
        result += _ + " ";
        let theroll = dice.roll(_)
        resultValue += `${theroll.result} [${theroll.rolled.join(', ')}] `;
      } else {
        return send(`${_} isn't in standard dice format.`)
      }
    }
    send(result += `=> ${resultValue}`);
}

var assert = require('assert');
module.exports.test = function(engine) {
  describe('Dice Plugin', function() {

    it('should do simple evaluations', function(done) {
      engine.test('roll 3d16', function(text) {
        assert( /3d16 => \d+/.test(text) );
        done();
      });
    });

    it('should do complex evaluations', function(done) {
      engine.test('roll 3d16 4d20*2+5', function(text) {
        assert(/3d16 4d20\*2\+5 => \d+/.test(text), text);
        done();
      });
    });

    it('should respond appropriately to incorrect syntax', function(done) {
      engine.test('roll 3$16', function(text) {
        assert.equal(text, "3$16 isn't in standard dice format.");
        done();
      });
    });

    it('should respond if just a dice roll', function(done) {
      engine.test('5d10*2+5', function(text) {
        assert(/5d10\*2\+5 => \d+/.test(text), text);
        done();
      });
    });
	
    it('should not respond to any text with roll', function(done) {
      engine.test('Hey, don\'t roll anything here', function(text) {
        fail();
      });
	  setTimeout(done, 100);
    });
  });
}
