const {decode} = require('html-entities');
const Twitter = require('twitter-lite');

module.exports = async function(engine) {

  const user = new Twitter({
    consumer_key: engine.config.twitter_consumer_key,
    consumer_secret: engine.config.twitter_consumer_secret
  });
  let auth = engine.brain('twitter_bearer_token')
  if(!auth) {
    const response = await user.getBearerToken();
    auth = response.access_token;
    engine.brain('twitter_bearer_token', auth)
    console.log("logged into twitter", auth)
  }
  const app = new Twitter({
    bearer_token: auth
  });

  async function getDream() {
    let since = undefined;
    let c = 0
    while(c++ < 50) {
      const options = {
        count: 200,
        screen_name: 'ctrlcreep',
        tweet_mode: 'extended',
        trim_user: true
      }
      if(since) options.max_id = since
      const tweets = await app.get('statuses/user_timeline', options)
      console.log(`got ${tweets.length} tweets`)
      const stats = tweets.reduce((p, c) => {
        if(c.favorite_count > 186) {
          p.num++
        }
        p.min = c.id_str < p.min ? c.id_str : p.min
        return p
      }, { num: 0, min: "zzzz" })
      console.log(`${stats.num} are contenders`)

      const alreadyMentioned = engine.brain('dreams') || []
      const alternateDimensions = tweets
        .sort((a,b) => b.favorite_count - a.favorite_count)
        .filter(t => !alreadyMentioned.includes(t.id_str) && t.favorite_count > 186)
      if(alternateDimensions.length === 0) {
        console.log('no new alternate dimensions available, I will continue the search...')
        since = stats.min
        if(since === 'zzzz') break;
        continue;

      } else {
        alreadyMentioned.push(alternateDimensions[0].id_str)
        engine.brain('dreams', alreadyMentioned)
        return decode(alternateDimensions[0].full_text, {level: 'html5'})
      }
    }
  }

  engine.on(/give me a dream/i, async (m, p, send) => {
    getDream().then(dream => send(dream))
      .catch(e => console.error(e));
  });

  engine.on(/good\s?night,? (team|everyone)/i, async (m, p, send) => {
    getDream().then(dream => send(dream))
      .catch(e => console.error(e));
  });
}
