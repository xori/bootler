/***
  Wallet
  A fictional money system where anyone can give anything but '$' is kept valid
  for some reason.
    > pay @Eric $10.40
    > give @Adam 3 internets
    > @Bootler what do I have?
  TODO: tests
*/
module.exports = function(robot) {
  robot.on(/^(?:give|pay)s? (@[^\s]+)\s+\$?([\d+\.]+)(.*?)s?$/i, function(M, params, send) {
    let giver = M.author + ""
    let user = M.mentions[0] + "";
    let amount = parseFloat(params[2]);
    let currency = params[3].trim().toUpperCase();

    if(amount < 0 || amount === NaN)
      return send('That is not a valid amount.')
    if(user === "undefined")
      return send('That is not a valid account.')
    if(currency === '') currency = "$";

    const bank = robot.brain('bank') || {};
    let account = bank[giver] = (bank[giver] || {});
    let account2 = bank[user] = (bank[user] || {});

    if(currency === '$' && account.$ - amount < 0)
      return send(`${giver} doesn't have enough $.`)

    account[currency] = (account[currency] || 0) - amount;
    account2[currency] = (account2[currency] || 0) + amount;
    if(account[currency] <= 0 || account[currency] === NaN) delete account[currency];

    send(`${user} now has ${humanize(currency, account2[currency])}`)
    robot.brain('bank', bank);
  })

  robot.respond(/(?:what do I have|(?:wallet|bank)\s?(?:balance)?)/i, function(M, params, send) {
    const bank = robot.brain('bank') || {};
    const user = M.author;
    send(report(user, bank));
  })

  robot.respond(/what does (@[^\s]+) have/i, function(M, params, send) {
    // because @Bootler will be the first mention
    const user = M.mentions[1] || M.mentions[0];
    if(!user) return send('That is not a valid account.')
    const bank = robot.brain('bank') || {};
    send(report(user, bank));
  })
}

function report(user, bank) {
  const account = bank[user+""] || {};

  let result = `${user}'s Assets:\n`;
  if(Object.keys(account).length === 0) result += "nothing...";
  for(let currency in account) {
    result += '  - ' + humanize(currency, account[currency]) + '\n';
  }
  return result;
}

function humanize(currency, amount) {
  let text = (parseInt(amount) === amount ? parseInt(amount) : amount) + "";
  if(currency.length === 1)
    return `${currency}${text}`
  else return `${text} ${currency}`
}
