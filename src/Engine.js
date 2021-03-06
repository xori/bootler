module.exports = class Engine {
  constructor(client) {
    this.client = client;
    this.config = require('./ConfigLoader');
    this.brain = require('./Brain');
    this.zzz = false;

    this.plugins = [];
    this._plugins = require('./PluginLoader');
    for(let i = 0; i < this._plugins.length; i++) {
      this._plugins[i](this); // startup.
    }
    this.http = require('node-fetch');
  }

  ////
  // .on(/hello world$/i, function(message, capture, send){
  //   send('goodbye world.');
  // })
  // Upon anyone sending a message to a channel the bot is in, this will check
  // the regex given and if it matches, run the accompanying function.
  on(regex, callback) {
    this.plugins.push({regex, callback});
  }

  ////
  // Similar to the .on() property but will only be checked if the bot was
  // @mentioned by name.
  respond(regex, callback) {
    this.plugins.push({regex, callback, mention: true});
  }

  ////
  // What the Discord Client runs on recieving a message.
  handle(message) {
    const that = this;
    let mentioned = message.mentions.length > 0 && message.mentions[0].bot;
    let content = message.cleanContent;
    let minimalContent = content
    if(mentioned && /^(?:[\w\s]+)?@(?:[\w\d]+).?\s(.+)$/.test(content)){
      minimalContent = content.match( /^(?:[\w\s]+)?@(?:[\w\d]+).?\s(.+)$/ )[1]
    }
    for(let i = 0; i < this.plugins.length; i++) {
      if(!mentioned && this.plugins[i].mention) continue;
      let tmp = content;
      if(this.plugins[i].mention) tmp = minimalContent;
      let capture = tmp.match(this.plugins[i].regex)
      if(capture) {
        this.plugins[i].callback(message, capture, function(m) {
          message.channel.send(m);
        })
      }
    }
  }

  ////
  // For testing, runs the .handle() with an overridden Discord Client.
  test(str, callback, override) {
    this.handle(Object.assign({
      mentions:[{bot: str.indexOf("@bot") > -1}],
      author: { bot: true },
      cleanContent: str,
      reply: callback
    }, override || {}), {
      sendMessage: function(_, result) {
        callback(result);
      }
    });
  }

  // For reporting errors if they occur.
  report(err) {
    if(err) console.error(err);
  }

}
