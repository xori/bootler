
let woken = 0
let sleepTimer;
const progression = [
  "Zzz. Zzz.", // skip this one.
  "Zzz. Zzz.",
  "*yawn* Oh come on. I don't wake up till 6.",
  "... Zzz. Zzz.",
  "Alright. Alright. I'm up."
]

function wakeup(engine) {
  engine.client.user.setPresence({ status: 'online' })
    .catch(console.error);
  engine.zzz = false
}

module.exports = function(engine, message, result) {
  woken = Math.min(5, woken+1);
  clearTimeout(sleepTimer);
  sleepTimer = setTimeout(() => woken = 0, 1000 * 60 * 45)

  const now = new Date();
  const time = now.getHours();
  const awake = time >= 6 && time <= 22

  if(awake) {
    wakeup(engine)
    return;
  }

  let msg = progression[woken]

  if(woken === 3) {
    msg = result.slice(0, Math.floor(result.length * 0.6)) + msg
  }
  if(woken === 4) {
    message.channel.send(msg);
    msg = result
    wakeup(engine)
  }
  if(woken === 5) {
    msg = result
  }

  message.channel.send(msg);
};
