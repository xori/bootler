// Command Syntax
// Hey @bootler, whats on sale on steam?
// [quantifier ]@bootler <command>

engine.onMention(regex, callback(Message, regexParams, sendFunc));
// Called when @bootler is mentioned in the message.
// sendFunc('message', MessageObj)
//   sending the MessageObj will *edit* an existing message.

engine.on(regex, callback(Message, regexParams));
// Called on every message.

engine.client
// Discord.js Client object for setting avatars and the like.

engine.test(string, callback(sentText))

engine.brain = { shared: 'data' }
// for global persistant data.
