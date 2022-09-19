const fs = require('fs-extra')
const config = require('./ConfigLoader')
const pack = require('../package.json');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const Engine = require('./Engine');

// create a new Discord client
const client = new Client({
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ]
});
const engine = new Engine(client);

client.on("messageCreate", function(message) {
  try {
    if(process.env.NODE_ENV !== 'production' && message.guild != null) {
      console.log(`skipping ${message.guild.name}:${message.channel.name || message.channel.recipient.username}> ${message.cleanContent}`);
      return;
    }
    engine.handle(message);
  } catch (e) {
    console.error(e);
    message.reply({ content: "Whoa, had a hard time with that comment. Should probably add that as an [issue](https://github.com/xori/bootler/issues)"});
  }
});

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Connected!');
});

// login to Discord with your app's token
client.login(config.token);
