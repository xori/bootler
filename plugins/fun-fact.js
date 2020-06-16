module.exports = function(engine) {
  const feed = "https://www.reddit.com/r/showerthoughts.json?limit=50"
  const interval = 1000 * 60 * 60 * 24 // 24 hours
  const plusOrminus = 1000 * 60 * 60 * 2 // ±2 hours

  function interestingThought() {
    return engine.http(feed, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if(res.ok) {
        return res.json()
      } else {
        throw res
      }
    }).then(body => {
      const obj = body
      const list = obj.data.children
      // sort idea by score, wisdom is timeless.
      list.sort((a,b) => b.data.score - a.data.score)
      // make sure our thought is unique
      let thoughts = engine.brain('thoughts') || []
      for(let i = 0; i < list.length; i++) {
        let item = list[i].data
        if(!thoughts.includes(item.id)) {
          thoughts.push(item.id)
          engine.brain('thoughts', thoughts)
          return item.title
        }
      }
      throw "already used all these thoughts"
    })
  }

  engine.on(/good morning,? (team|everyone)/i, (m, p, send) => {
    interestingThought().then(thought => send(thought))
      .catch(e => console.error(e));
  });

  engine.on(/give me a thought/i, (m, p, send) => {
    interestingThought().then(thought => send(thought))
      .catch(e => console.error(e));
  });
}
