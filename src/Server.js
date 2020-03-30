const fs = require('fs-extra')
const config = require('./ConfigLoader')
const pack = require('../package.json');
const Discord = require("discord.js");
const Engine = require('./Engine');

// create a new Discord client
const client = new Discord.Client();
const engine = new Engine(client);

client.on("message", function(message) {
  try {
    if(process.env.NODE_ENV !== 'production' && message.guild != null) {
      console.log(`skipping ${message.guild.name}:${message.channel.name || message.channel.recipient.username}> ${message.cleanContent}`);
      return;
    }
    // console.log(`${message.guild.name}:${message.channel.name || message.channel.recipient.username}> ${message.cleanContent}`);
    engine.handle(message);
  } catch (e) {
    console.error(e);
    bot.reply(message, "Whoa, had a hard time with that comment. Should probably add that as an [issue](https://github.com/xori/bootler/issues)");
  }
});

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Connected!');
});

// login to Discord with your app's token
client.login(config.token);
