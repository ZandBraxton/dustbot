const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}
// const commandFiles = fs
//   .readdirSync("./commands")
//   .filter((file) => file.endsWith(".js"));

const clientId = process.env.CLIENT_ID;
// const guildId = process.env.GUILD_ID;
const guildId = process.env.HOOK_GUILD_ID;

// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);
//   commands.push(command.data.toJSON());
// }

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);
rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
