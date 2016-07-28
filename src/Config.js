const fs = require('fs-extra');
const path = require('path');
const configPath = path.resolve(__dirname, 'config.js');
let config = {};

try {
  fs.accessSync(configPath, fs.F_OK);
  config = fs.readJsonSync(configPath);
} catch (e) {
  console.error(e);
}

config["token"] = process.env.DISCORD_TOKEN || config["token"];
config["google_api"] = process.env.GOOGLE_API || config["google_api"];
config["brain"] = process.env.DISCORD_BRAIN || config["brain"] || "./brain";

module.exports = config;
