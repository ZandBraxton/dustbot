require("dotenv").config();
const fs = require("node:fs");
const fetch = require("node-fetch");
const path = require("node:path");
const { games } = require("./data/games.json");
const { Client, Collection, Intents } = require("discord.js");
const { getCharacters } = require("./database/queries");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    "GUILDS",
  ],
});

client.on("ready", () => {
  console.log("ready!");
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
  if (interaction.isAutocomplete()) {
    console.log(interaction.options._hoistedOptions[0].value);
    if (
      interaction.commandName === "character" ||
      interaction.commandName === "games"
    ) {
      const focusedOption = interaction.options.getFocused(true);
      console.log(focusedOption);
      let choices = [];

      if (focusedOption.name === "game") {
        for (let i = 0; i < games.length; i++) {
          choices.push({ name: games[i].title, value: games[i].path });
        }
      }

      if (focusedOption.name === "character-name") {
        console.log(interaction.options._hoistedOptions[0].value);
        // const gameName = games.find(
        //   (game) => game.title === interaction.options._hoistedOptions[0].value
        // );

        // console.log(gameName);
        // console.log(`http://127.0.0.1:8000/${gameName.fullPath}`);
        const result = await getCharacters("DBFZ");

        if (focusedOption.value !== "" && result.length > 24) {
          const characterFilter = result.filter((character) =>
            character.name.startsWith(focusedOption.value.toUpperCase())
          );
          return await interaction.respond(
            characterFilter.map((character) => ({
              name: character.name,
              value: character.name,
            }))
          );
        }

        if (result.length >= 25) {
          for (let i = 0; i < 24; i++) {
            choices.push(result[i]);
          }
          choices.push({ name: "Type to view more", path: "" });
        } else {
          result.map((ch) => choices.push(ch));
        }

        return await interaction.respond(
          choices.map((character) => ({
            name: character.name,
            value: character.name,
          }))
        );
      }

      const filtered = choices.filter((choice) =>
        choice.name.startsWith(focusedOption.value.toUpperCase())
      );
      console.log(focusedOption.value);
      console.log(filtered);
      await interaction.respond(
        filtered.map((choice) => ({ name: choice.name, value: choice.value }))
      );
    }
  }

  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.BOT_TOKEN);

// app.get("/name", callName);

// function callName(req, res) {
//   // Use child_process.spawn method from
//   // child_process module and assign it
//   // to variable spawn
//   var spawn = require("child_process").spawn;

//   // Parameters passed in spawn -
//   // 1. type_of_script
//   // 2. list containing Path of the script
//   // and arguments for the script

//   // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
//   // so, first name = Mike and last name = Will
//   var process = spawn("python", ["./index.py"]);

//   // Takes stdout data from script which executed
//   // with arguments and send this data to res object
//   process.stdout.on("data", function (data) {
//     res.send(data.toString());
//   });
// }

// const p = require('../../python projects/web-scraper/src/index.py')
