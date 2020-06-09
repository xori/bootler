const fs = require('fs-extra');
const path = require('path');
const configPath = path.resolve('config.json');
let config = {};

try {
  fs.accessSync(configPath, fs.F_OK);
  config = fs.readJsonSync(configPath);
} catch (e) { }

config.token = process.env.DISCORD_TOKEN || config.token;
config.twitter_consumer_key = process.env.TWITTER_CONSUMER_KEY || config.twitter_consumer_key;
config.twitter_consumer_secret = process.env.TWITTER_CONSUMER_SECRET || config.twitter_consumer_secret;
config.token = process.env.DISCORD_TOKEN || config.token;
config.google_api = process.env.GOOGLE_API || config.google_api;
config.brain = process.env.DISCORD_BRAIN || config.brain || "./brain";
config.bootup = new Date();

module.exports = config;
