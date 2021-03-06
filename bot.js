require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { games } = require("./data/games.json");
const { Client, Collection, Intents } = require("discord.js");
const { getCharacters, getMoveset } = require("./database/queries");
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
    if (
      interaction.commandName === "character" ||
      interaction.commandName === "game-roster" ||
      interaction.commandName === "move"
    ) {
      const focusedOption = interaction.options.getFocused(true);
      let choices = [];
      let result;

      if (focusedOption.name === "game") {
        for (let i = 0; i < games.length; i++) {
          choices.push({ name: games[i].title, value: games[i].path });
        }
      }

      //pulls character data and displays it as options
      if (focusedOption.name === "character-name") {
        let characters;

        try {
          const result = await getCharacters(
            interaction.options._hoistedOptions[0].value
          );

          if (focusedOption.value !== "") {
            const characterFilter = result.filter((character) =>
              character.name
                .toLocaleLowerCase()
                .match(focusedOption.value.toLocaleLowerCase())
            );

            characters = characterFilter;
          } else {
            characters = result;
          }

          if (characters.length >= 25) {
            for (let i = 0; i < 24; i++) {
              choices.push(characters[i]);
            }
            choices.push({ name: "Type to view more", path: "" });
          } else {
            characters.map((ch) => choices.push(ch));
          }

          return await interaction.respond(
            choices.map((character) => ({
              name: character.name,
              value: character.name,
            }))
          );
        } catch (error) {
          console.log(error);
        }
      }

      if (focusedOption.name === "move-type") {
        try {
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

          return await interaction.respond(
            choices.map((element) => ({
              name: element,
              value: element,
            }))
          );
        } catch (error) {
          console.log(error);
        }
      }

      if (focusedOption.name === "move") {
        try {
          const result = await getMoveset(
            interaction.options._hoistedOptions[0].value,
            interaction.options._hoistedOptions[1].value
          );

          const moveSetResult = result.find(
            (list) =>
              list.moveType === interaction.options._hoistedOptions[2].value
          );

          let moveSet;

          if (focusedOption.value !== "") {
            const filter = moveSetResult.moveList.filter((move) =>
              move.name
                ? move.name
                    .toLocaleLowerCase()
                    .match(focusedOption.value.toLocaleLowerCase())
                : move.input
                    .toLocaleLowerCase()
                    .match(focusedOption.value.toLocaleLowerCase())
            );
            moveSet = filter;
          } else {
            moveSet = moveSetResult.moveList;
          }

          if (moveSet.length >= 25) {
            for (let i = 0; i < 24; i++) {
              if (moveSet[i].name && moveSet[i].input) {
                if (moveSet[i].name === moveSet[i].input) {
                  choices.push(moveSet[i].input);
                } else {
                  choices.push(`${moveSet[i].name} [${moveSet[i].input}]`);
                }
              } else if (!moveSet[i].name && moveSet[i].input) {
                choices.push(moveSet[i].input);
              } else if (moveSet[i].name && !moveSet[i].input) {
                choices.push(moveSet[i].name);
              } else {
                choices.push("N/A");
              }
            }
            choices.push("Type to view more");
          } else {
            moveSet.map((move) => {
              if (move.name && move.input) {
                if (move.name === move.input) {
                  choices.push(move.input);
                } else {
                  choices.push(`${move.name} [${move.input}]`);
                }
              } else if (!move.name && move.input) {
                choices.push(move.input);
              } else if (move.name && !move.input) {
                choices.push(move.name);
              } else {
                choices.push("N/A");
              }
            });
          }

          return await interaction.respond(
            choices.map((move) => ({ name: move, value: move }))
          );
        } catch (error) {
          console.log(error);
        }
      }
      try {
        const filtered = choices.filter((choice) =>
          choice.name
            .toLocaleLowerCase()
            .match(focusedOption.value.toLocaleLowerCase())
        );

        await interaction.respond(
          filtered.map((choice) => ({ name: choice.name, value: choice.value }))
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    const channel = interaction.member.guild.channels.cache.get(
      interaction.channelId
    );
    if (channel.type !== "GUILD_VOICE") {
      await command.execute(interaction, client);
    } else {
      await interaction.reply({
        content: "Dustbot commands cannot be called in voice channels.",
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);
    try {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
});

client.login(process.env.BOT_TOKEN);
