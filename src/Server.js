const fs = require('fs-extra')
const config = require('./ConfigLoader')
const pack = require('../package.json');
const Discord = require("discord.js");
const Engine = require('./Engine');

const bot = new Discord.Client({autoReconnect:true});
const engine = new Engine(bot);

bot.on("message", function(message) {
  try {
    console.log(`${(new Date).toISOString()}:${message.channel.name}> ${message.cleanContent}`);
    engine.handle(message, bot);
  } catch (e) {
    console.error(e);
    bot.reply(message, "Whoa, had a hard time with that comment. Should probably add that as an [issue](https://github.com/xori/bootler/issues)");
  }
});

bot.loginWithToken(config.token)
  .then(function() {
    console.log("Connected.");
  }).catch(function(err) {
    console.error(err);
});
