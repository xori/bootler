const assert = require('assert');
const Engine = require('../src/Engine');
let plugins = require('../src/PluginLoader');
let engine = new Engine();

describe('Bot Engine', function() {
  it('has the proper interface', function() {
    assert.ok(engine.on);
    assert.ok(engine.respond);
    assert.ok(engine.test);
  })

  describe('Plugins', function() {
    for(let i = 0; i < plugins.length; i++) {
      if(plugins[i].test)
        plugins[i].test(engine);
    }
  })
});
