/***
  Example Usage:
    let bank = engine.brain('bank');
    bank['evan'] += 1000.00;
    engine.brain('bank', bank);
***/
const path = require('path');
const fs = require('fs-extra');
const pack = require('../package.json');
const config = require('./Config')
const dbLocation = path.resolve(config.brain, 'brain.json');
console.log(dbLocation);

fs.ensureFileSync(dbLocation);
let database = fs.readJsonSync(dbLocation, {throws: false}) || {};

module.exports = function(keyword, data) {
  if(data === undefined) {
    return database[keyword];
  }

  database[keyword] = data;
  fs.writeJson(dbLocation, database, function(err) {
    if(err) console.error(err);
  });
  return data;
}
