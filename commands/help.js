const { RichEmbed } = require("discord.js");

exports.run = async(client, msg, args, date) => {
  if (!args[0]) {
    const enabledCommands = client.commands.filter(c => c.conf.enabled === true);
    const commandNames = enabledCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    msg.edit(new RichEmbed()
      .setColor(0x3498DB)
      .setTitle("SelfBot Command List")
      .addField(`Use ${process.env.prefix}help <commandname> for details on a command`, `${enabledCommands.map(c => `${process.env.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}`).join("\n")}`)
    );
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      msg.edit(new RichEmbed()
        .setColor(0x3498DB)
        .setTitle(`Help for __${command.help.name}__ command`)
        .addField("Description", command.help.description)
        .addField("Usage", command.help.usage)
      );
    } else {
      console.log(`[${date}] ... but the command name was invalid!`);
      const m = await msg.edit("We couldn't find that command!");
      m.delete(3000);
    }
  }
};

exports.conf = {
  enabled: true,
  aliases: []
};

exports.help = {
  name: "help",
  description: "Displays all the available commands.",
  usage: "`help [command]`"
};
