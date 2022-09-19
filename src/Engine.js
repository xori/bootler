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
    this.http = null;
    import('node-fetch').then(resolved => {
      this.http = resolved.default
    })
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
    let mentioned = Array.from(message.mentions.users.values()).some(user => user.bot && user.username === 'Bootler')
    let content = message.content;
    for(let i = 0; i < this.plugins.length; i++) {
      if(!mentioned && this.plugins[i].mention) continue;
      let capture = content.match(this.plugins[i].regex)
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
    let mentions = []
    if (override?.mentioned || str.indexOf("@bot") > -1) {
      mentions = [[
        '101', {
          bot: true,
          username: 'Bootler',
        }
      ]]
    }

    this.handle(Object.assign({
      author: { bot: true },
      content: str,
      reply: callback,
      channel: {
        send: callback,
      },
      mentions: {
        users: new Map(mentions)
      },
    }, override || {}));
  }

  // For reporting errors if they occur.
  report(err) {
    if(err) console.error(err);
  }

}
