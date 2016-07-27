const R = require('roll');

module.exports = function(engine) {
  engine.respond(/roll ([^\s]+)$/i, function(message, params, send) {
    let ask = params[1];
    let dice = new R();

    if(dice.validate(ask)) {
      send(`${ask} => ${dice.roll(ask).result}`);
    } else {
      send(`That ain't a valid roll.`)
    }
  });
}

var assert = require('assert');
module.exports.test = function(engine) {
  describe('Dice Plugin', function() {

    it('should do simple evaluations', function(done) {
      engine.test('@bot roll 3d16', function(text) {
        assert( /3d16 => \d+/.test(text) );
        done();
      });
    });

    it('should respond appropriately to incorrect syntax', function(done) {
      engine.test('@bot roll 3$16', function(text) {
        assert.equal(text, "That ain't a valid roll.");
        done();
      });
    })
  });
}
