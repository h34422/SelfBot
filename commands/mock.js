exports.run = async (client, msg, date, Discord, args) => {
  const mockify = async (input) => {
    return await input.split("").map((value, index) => index % 2 ? value.toUpperCase() : value.toLowerCase()).join("");
  };
  await msg.edit(mockify(args.join(" ")));
  console.log(mockify(`[${date}] Some text has been mockified!`));
};
