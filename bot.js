require("dotenv").config();
const fs = require("node:fs");
const fetch = require("node-fetch");
const path = require("node:path");
const { games } = require("./data/games.json");
const { Client, Collection, Intents } = require("discord.js");
const {
  getCharacters,
  getCharacter,
  getMoveset,
} = require("./database/queries");
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
    console.log(interaction.options._hoistedOptions);
    if (
      interaction.commandName === "character" ||
      interaction.commandName === "games" ||
      interaction.commandName === "move"
    ) {
      const focusedOption = interaction.options.getFocused(true);
      console.log(focusedOption);
      let choices = [];
      let result;

      if (focusedOption.name === "game") {
        for (let i = 0; i < games.length; i++) {
          choices.push({ name: games[i].title, value: games[i].path });
        }
      }

      if (focusedOption.name === "character-name") {
        console.log(interaction.options._hoistedOptions[0].value);
        const result = await getCharacters(
          interaction.options._hoistedOptions[0].value
        );

        if (focusedOption.value !== "" && result.length > 24) {
          const characterFilter = result.filter((character) =>
            character.name
              .toLocaleLowerCase()
              .match(focusedOption.value.toLocaleLowerCase())
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

      if (focusedOption.name === "move-type") {
        // const result = await getCharacter(
        //   interaction.options._hoistedOptions[0].value,
        //   interaction.options._hoistedOptions[1].value
        // );
        result = await getMoveset(
          interaction.options._hoistedOptions[0].value,
          interaction.options._hoistedOptions[1].value
        );

        if (focusedOption.value !== "") {
          const filter = result.filter((element) =>
            element.moveType
              .toLocaleLowerCase()
              .match(focusedOption.value.toLocaleLowerCase())
          );
          return await interaction.respond(
            filter.map((element) => ({
              name: element.moveType,
              value: element.moveType,
            }))
          );
        }

        result.map((el) => choices.push(el.moveType));
        console.log(choices);

        return await interaction.respond(
          choices.map((element) => ({
            name: element,
            value: element,
          }))
        );
      }

      if (focusedOption.name === "move") {
        const result = await getMoveset(
          interaction.options._hoistedOptions[0].value,
          interaction.options._hoistedOptions[1].value
        );

        const moveSet = result.find(
          (list) =>
            list.moveType === interaction.options._hoistedOptions[2].value
        );

        if (focusedOption.value !== "") {
          const filter = moveSet.moveList.filter((move) =>
            move.name
              ? move.name
                  .toLocaleLowerCase()
                  .match(focusedOption.value.toLocaleLowerCase())
              : move.input
                  .toLocaleLowerCase()
                  .match(focusedOption.value.toLocaleLowerCase())
          );
          return await interaction.respond(
            filter.map((move) => ({
              name: move.name ? move.name : move.input,
              value: move.name ? move.name : move.input,
            }))
          );
        }

        if (moveSet.moveList.length >= 25) {
          for (let i = 0; i < 24; i++) {
            choices.push(
              moveSet.moveList[i].name
                ? moveSet.moveList[i].name
                : moveSet.moveList[i].input
            );
          }
          choices.push({ name: "Type to view more", path: "" });
        } else {
          moveSet.moveList.map((move) =>
            choices.push(move.name ? move.name : move.input)
          );
        }

        console.log(choices);

        return await interaction.respond(
          choices.map((move) => ({ name: move, value: move }))
        );
      }

      const filtered = choices.filter(
        (choice) =>
          choice.name
            .toLocaleLowerCase()
            .match(focusedOption.value.toLocaleLowerCase())
        // choice.name.startsWith(focusedOption.value.toUpperCase())
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
