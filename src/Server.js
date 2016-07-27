let config = {};
if(!process.env.DISCORD_TOKEN)
  config = require('../config');
let pack = require('../package.json');
let Discord = require("discord.js");
let Engine = require('./Engine');

let bot = new Discord.Client();
let engine = new Engine();

bot.on("message", function(message) {
  engine.handle(message, bot);
});

bot.loginWithToken(process.env.DISCORD_TOKEN || config.token)
  .then(function() {
    console.log("Connected.");
  }).catch(function(err) {
    console.error(err);
});
