function pickone(options) {
  const i = Math.floor(Math.random() * options.length)
  return options[i]
}

// PLAYING STREAMING LISTENING WATCHING
const activities = [
  ['PLAYING', 'in Limbo.'],
  ['STREAMING', 'the best show.', 'https://www.youtube.com/watch?v=NkNXERhiXNw&list=PL3oTh7HxUAl-QvH5Lszu_RzzarIqvFYdk'],
  ['LISTENING', 'sweet tunes.'],
  ['LISTENING', 'LoFi Hip Hop Beats.', 'https://www.youtube.com/watch?v=5qap5aO4i9A'],
  ['LISTENING', 'some Binary Stars.'],
  ['PLAYING', 'Mario Party'],
  ['PLAYING', 'Animal Crossing'],
]

module.exports = function(engine) {

  engine.on( /^wake\s?up$/i, function(m, p, send) {
    console.log(engine.zzz)
    if(engine.zzz) {
      send(pickone([
        "Awwww geees     ",
        "Nnnnrrrrrggggg       ",
        "I don't wanna be awake",
      ]))
    }
  });


  function doSomething() {
    // if not logged in, don't do anything.
    if(engine.client.user == null) {
      console.error("poop, we aren't logged in.")
      return;
    }

    // what time is it? We goto bed at 10pm and wake up around 6am
    const now = new Date();
    if(now.getHours() >= 22 || now.getHours() <= 6) {
      // I'm sleeping.
      engine.client.user.setPresence({ status: 'invisible' })
        .catch(console.error);
      engine.zzz = true;
      return;
    } else {
      engine.zzz = false;
    }

    const action = Math.random()
    // 55% chance of nothing happening.
    if(action < 0.55) {
      engine.client.user.setPresence({ status: 'online' })
        .catch(console.error);
    } else {
      const i = Math.floor(Math.random() * activities.length)
      const activity = activities[i]
      engine.client.user.setPresence({
        activity: {
          type: activity[0],
          name: activity[1],
           url: activity[2]
        },
        status: 'online'
      })
        .catch(console.error);
    }

  }

  setInterval(doSomething, 1000 * 60 * 60) // once per hour
  setTimeout(doSomething, 2000)
}
