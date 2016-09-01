var BlackJack = require('../games/blackjack');

module.exports = function(engine) {
  var bank = new (require('./bank').library)(engine);
  var dealer = undefined;
/*
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

  function isntGameChannel(message) {
    return !message.channel.name.match(/blackjack/i);
  }

  engine.on(/^new game$/i, function(message, params, send) {
    if(isntGameChannel(message)) return
    if(dealer && dealer.state != "complete") return send('game is in progress.');

    dealer = new BlackJack();
    send("New game started. Place your bets.");
  });

  engine.on(/^bet \$?([\d\.]+)$/i, function(message, params, send) {
    if(isntGameChannel(message)) return
    if(!dealer) return send("call for a 'new game'");
    if(dealer.state != "waiting for bets") return send("You'll have to wait.")

    var player = message.author;
    try {
      var bet = parseFloat(params[1])
    } catch(e) { return send("that's not a real number"); }

    if(!bank.has(player + "", bet)) {
      return send("you don't have that much money.");
    } else if(bet < 0.00001) {
      return send("you need to bet more than that.")
    } else {
      dealer.takeBet(player + "", bet);
      send(player + " bets $" + bet);
    }
  });

  engine.on(/^start(?: game)?$/i, function(message, params, send) {
    if(isntGameChannel(message)) return;
    if(!dealer) return send("call for a 'new game'");
    if(dealer.state != "waiting for bets") return send("You'll have to wait.")

    send(dealer.deal());
    if(dealer.state.match(/^waiting on/i)) {
      send(dealer.render());
      for(var key in dealer.players) {
        bank.take(key, dealer.players[key].bet); // I should kick them if they don't have enough.
      }
    }
  });

  function handleEndGame(send) {
    send(dealer.render());
    var result = "";
    for(var key in dealer.players) {
      bank.give(key, dealer.players[key].awarded);
      result += `${key} awarded $${dealer.players[key].awarded}\n`;
    }
    send(result);
    setTimeout(function() {
      dealer = new BlackJack();
      send("New game started. Place your bets.");
    }, 200);
  }

  engine.on(/^hit/i, function(message, params, send) {
    if(isntGameChannel(message)) return;
    if(!dealer) return send("call for a 'new game'");
    if(!dealer.state.startsWith("waiting on")) return send("You can't take cards yet.")

    var result = dealer.giveCard(message.author + "");
    if(dealer.isdone()) handleEndGame(send);
    else send(result);
  });

  engine.on(/^stand|stay$/i, function(message, params, send) {
    if(isntGameChannel(message)) return;
    if(!dealer) return send("call for a 'new game'");
    if(!dealer.state.startsWith("waiting on")) return send("You can't do this right now.")

    var result = (dealer.stand(message.author + ""));
    if(dealer.isdone()) handleEndGame(send);
    else send(result);
  });

  engine.on(/^(?:i )?surrender/i, function(message, params, send) {
    if(isntGameChannel(message)) return;
    if(!dealer.state.startsWith("waiting on")) return send("You can't do this right now.");
    if(!dealer.players[message.author + ""]) return send("You aren't playing.");
    if(dealer.players[message.author + ""].done) return send("You can't surrender after you're done.")
    bank.give(message.author + "", dealer.players[message.author + ""].bet / 2.0);
    send(`${message.author} surrenders $${dealer.players[message.author + ""].bet / 2.0}`);
    delete dealer.players[message.author + ""];
    if(Object.keys(dealer.players).length == 0) {
      dealer = new BlackJack();
      return send("New game started. Place your bets.");
    }
    if(dealer.isdone()) handleEndGame(send);
  });
}
