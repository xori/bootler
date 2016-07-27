let config = {};
if(!process.env.DISCORD_TOKEN)
  config = require('../config');
let pack = require('../package.json');
let Discord = require("discord.js");
let Engine = require('./Engine');

let bot = new Discord.Client();
let engine = new Engine(bot);

bot.on("message", function(message) {
  try {
    engine.handle(message, bot);
  } catch (e) {
    bot.reply(message, "Whoa, had a hard time with that comment. Should probably add that as an [issue](https://github.com/xori/bootler/issues)");
  }
});

bot.loginWithToken(process.env.DISCORD_TOKEN || config.token, "")
  .then(function() {
    console.log("Connected.");
  }).catch(function(err) {
    console.error(err);
});
