var cards = require('cards');
// var bank = require('./bank').library;
var status, players, deck, player;

module.exports = function(engine) {
/*
  me: @bot loan me $150
  me: new game
  bot: awaiting bets...
  me: bet $50
  me: start game
  bot: cards...
  me: hit me
  me: stay
  bot: cards
  bot: Players win
  bot: Payout: ...
  me: new game
  ...

  Command List:
    - @bot loan me $X
        Should load him $X, if > $100 owed put him in the Role "Scumbag"
    - new game
        Should prompt for betting.
    - bet $X
        Includes author in round and deducts money to the betting pool.
    - start game
    - hit me
    - stay
    - skip @Player
        Delays for 10 sec then "surrenders" the player, refunding half their bet

  Statuses: "NO GAME", "BETS", "WAITING"
  */

  function reset() {
    status  = "NO GAME";
    players = []; // users that are playing this round.
    deck    = new cards.PokerDeck();
    player  = { name: "Player", hand: [], bet: 0, done: false }
  }
  reset();

  function isntGameChannel(message) {
    return message.channel.match(/gaming/);
  }

  function getStatus() {
    return "WAITING ON " + (status == 'BETS' ? "BETS" :
      players.filter((p) => { return !p.done})
             .map((p) => { return p.name })
             .join(', '));
  }

  engine.on(/^new game$/i, function(message, params, send) {
    if(isntGameChannel(message)) return
    if(status != "NO GAME") return send(getStatus())

    reset();
    status = "BETS"
    send("Place your bets.");
  });

  engine.on(/^bet \$?([\d\.]+)$/i, function(message, params, send) {
    if(isntGameChannel(message)) return
    if(status != "BETS") return send("You'll have to wait.")

    var player = message.author;
    try {
      var bet = parseInt(params)
    } catch(e) { return }

    if(players[player.name] && players[player.name].bet > 0) {
      // bank.refund(players[player.name].bet)
    } else if(bet > 0.00001) {
      // try {
      //   bank.subtract(bet, player);
      // } catch(e) {
      //   return send(author + " doesn't have the money");
      // }
      players[player.name] = Object.assign({}, player, { name: player.name, bet: bet });
    }
  });

  engine.on(/^start game$/i, function(message, params, send) {
    if(isntGameChannel(message)) return
    if(status != "BETS" && players.length > 0) return send("You'll have to wait.")

    var deck.draw()
}
