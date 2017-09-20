const { Client, Collection, version } = require("discord.js");

const client = new Client({
  disabledEvents: [ // Used ones are commented out
    // "READY",
    // "RESUMED",
    "GUILD_SYNC",
    "GUILD_CREATE",
    "GUILD_DELETE",
    "GUILD_UPDATE",
    "GUILD_MEMBER_ADD",
    "GUILD_MEMBER_REMOVE",
    "GUILD_MEMBER_UPDATE",
    // "GUILD_MEMBERS_CHUNK",
    "GUILD_ROLE_CREATE",
    "GUILD_ROLE_DELETE",
    "GUILD_ROLE_UPDATE",
    "GUILD_BAN_ADD",
    "GUILD_BAN_REMOVE",
    "CHANNEL_CREATE",
    "CHANNEL_DELETE",
    "CHANNEL_UPDATE",
    "CHANNEL_PINS_UPDATE",
    // "MESSAGE_CREATE",
    // "MESSAGE_DELETE",
    // "MESSAGE_UPDATE",
    "MESSAGE_DELETE_BULK",
    "MESSAGE_REACTION_ADD",
    "MESSAGE_REACTION_REMOVE",
    "MESSAGE_REACTION_REMOVE_ALL",
    "USER_UPDATE",
    "USER_NOTE_UPDATE",
    "USER_SETTINGS_UPDATE",
    // "PRESENCE_UPDATE",
    "VOICE_STATE_UPDATE",
    "TYPING_START",
    "VOICE_SERVER_UPDATE",
    "RELATIONSHIP_ADD",
    "RELATIONSHIP_REMOVE"
  ]
});

console.log(`Starting SelfBot... (v${require("./package.json").version})\nNode version: ${process.version}\nDiscord.js version: ${version}`);

require("raven").config(process.env.ravenDSN).install(); // It's pretty useless with a selfbot so will probably remove it in the future.

require("sqlite").open("./db/deletedMessages.sqlite");

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

client.commands = new Collection();
client.aliases = new Collection();

require("./modules/utils.js")(client);
require("./modules/fun.js")(client);

(async function() {
  //Load commands into memory from "./commands"
  const commandFiles = await readdir("./commands");
  console.log(`Loading ${commandFiles.length} files!`);


  for(let file of commandFiles) {
    try {
      const props = require(`./commands/${file}`);
      console.log(`Loading Command: ${props.help.name}.`);
      client.commands.set(props.help.name, props);
      for(let alias of props.conf.aliases) {
        client.aliases.set(alias, props.help.name);
      }
    } catch (err) {
      console.log(`Unable to load command ${file}: \n${err}`);
    }
  }


  /*
  commandFiles.forEach(file => {
    try {
      const props = require(`./commands/${file}`);
      console.log(`Loading Command: ${props.help.name}.`);
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    } catch (err) {
      console.log(`Unable to load command ${file}: \n${err}`);
    }
  });
  */

  const evtFiles = await readdir("./events/");
  console.log(`Loading a total of ${evtFiles.length} events.`);


  for(let file of evtFiles) {
    try {
      const eventName = file.split(".")[0];
      const event = require(`./events/${file}`);
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    } catch (err) {
      console.log(`Unable to load event ${file}: \n${err}.`);
    }
  }

  /*
  evtFiles.forEach(file => {
    try {
      const eventName = file.split(".")[0];
      const event = require(`./events/${file}`);
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    } catch (err) {
      console.log(`Unable to load event ${file}: \n${err}.`);
    }
  });
  */

  client.login(process.env.token);
}());