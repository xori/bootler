
module.exports = function(robot) {
  robot.on(/^(?:give|pay)s? (@[^\s]+)\s+\$?([\d+\.]+)(.*?)s?$/i, function(M, params, send) {
    let giver = robot.client.users.get('id', M.author.id) + "";
    let user = M.mentions[0] + "";
    let amount = parseFloat(params[2]);
    let currency = params[3].trim().toUpperCase();

    if(amount < 0 || amount === NaN)
      return send('That is not a valid amount.')
    if(user === "undefined")
      return send('That is not a valid account.')

    let bank = robot.brain('bank') || {};
    let account = bank[giver] = (bank[giver] || {});
    let account2 = bank[user] = (bank[user] || {});
    if(currency === '') { // "REAL" money
      if(account.$ - amount > 0) {
        account.$ -= amount;
        account2.$ = (account2.$ || 0) + amount;
        send(`${user} now has \$${account2.$.toFixed(4)}`)
      } else {
        return send(`${giver} doesn't have enough $.`)
      }
    } else {
      account2[currency] = (account2[currency] || 0) + amount;
      send(`${user} now has ${account2[currency].toFixed(4)} ${currency}`)
    }

    robot.brain('bank', bank);
  })
}
