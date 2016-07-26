// example of a command

module.exports = function(engine) {
  engine.onMention(
    /what'?s on sale(?: on )(steam|humble)\??/i, 
    function(message, params, send) {
      var msg = message;
      var store = params[1] || "all"; // steam | humble
      message = getSales(store);
      var MessageObj = send("Fetching sales...");
      send("new ${message}", MessageObj); // update message
  });
}

module.exports.title = "Video Game Sales";

module.exports.test = function(engine) {
  describe('Basic Usage', function() {
    this.timeout(10000) // maximum I should be waiting is 10sec.
    
    it('should at least respond', function(done) {
      engine.test('@bot whats on sale', done); // responds with something
    });
    
    it('should get at least one sale', function(done) {
      var callbacks = 0;
      engine.test('@bot whats on sale on humble?', function(message, mobj) {
        if(callbacks == 0) {
          callbacks++; // we want the message edit.
          assert.equal(message, "Fetching sales...");
        } else {
          assert.true(message.length > 0);
          done();
        }
      })
    })
    
  });
}
