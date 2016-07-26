var config = require('../config');
var pack = require('../package.json');
var Discord = require("discord.js");
var bot = new Discord.Client();

var plugins = [  ];
var engine = {
  on: function(regex, callback) {
    plugins.push({regex, callback});
  },
  onMention: function(regex, callback) {
    plugins.push({regex, callback, mention: true});
  }
}

require('../plugins/dice')(engine)

bot.on("message", function(message) {
    if(message.content === "ping") {
      bot.reply(message, `pong ${pack.version}`);
    } else {
      let mentioned = message.mentions.length > 0 && message.mentions[0].bot;
      let content = message.cleanContent;
      for(let i = 0; i < plugins.length; i++) {
        if(!mentioned && plugins[i].mention) continue;
        let capture = content.match(plugins[i].regex)
        if(capture) {
          plugins[i].callback(message, capture, function(m) {
            bot.reply(message, m);
          })
        }
      }
    }
});

bot.loginWithToken(config.token);
