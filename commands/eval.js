exports.run = (client, msg, date, Discord, args, math, forecast, sql, clean) => { //Import everything for all commands and stuff

  var code = args.join(" ");
  try {
    var evaled = eval(code);

    if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled);

    var cleanEval = clean(evaled);
    if (args.length > 0) {
      msg.edit(`:inbox_tray: **INPUT**\`\`\`js\n${code}\n\`\`\`\n:outbox_tray: **OUTPUT**\n\`\`\`js\n${cleanEval}\n\`\`\``);
      console.log(`[${date}] An eval command was used!`);
    } else if (args.length === 0) {
      msg.edit(`:warning: No arguments were provided! :warning:`).then(m => m.delete(2000));
    }
  } catch (err) {
    msg.edit(`:inbox_tray: **INPUT**\`\`\`js\n${code}\n\`\`\`\n:outbox_tray: **OUTPUT**\n\`\`\`js\n${clean(err)}\n\`\`\``);
    console.log(`[${date}] Eval command failed!\nERROR:\n${err}`);
  }
};
