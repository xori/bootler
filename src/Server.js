const fs = require('fs-extra')
const config = require('./Config')
const pack = require('../package.json');
const Discord = require("discord.js");
const Engine = require('./Engine');

const bot = new Discord.Client({autoReconnect:true});
const engine = new Engine(bot);

bot.on("message", function(message) {
  try {
    engine.handle(message, bot);
  } catch (e) {
    bot.reply(message, "Whoa, had a hard time with that comment. Should probably add that as an [issue](https://github.com/xori/bootler/issues)");
  }
});

bot.loginWithToken(config.token)
  .then(function() {
    console.log("Connected.");
  }).catch(function(err) {
    console.error(err);
});
