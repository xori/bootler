
module.exports = function(engine) {
  engine.on(/^(\d+)d(\d+)$/i, function(message, params, send) {
    let total = 0;
    let script = "";
    let n = parseInt(params[1]);
    let die = parseInt(params[2]);
    for(let i = 0; i < n; i++) {
      let amount = Math.floor(Math.random() * die) + 1;
      total += amount;
      script += `(${amount})`;
    }
    send(`${script} => ${total}`)
  })
}
