const fetch = require("node-fetch");
const dummydata = require("../commands/dummydata.json");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
} = require("discord.js");

const { getCharacters } = require("./getCharacters");
const { getCharacterInfo } = require("./getCharacterInfo");
const { getMoveInfo } = require("./getMoveInfo");

async function generateEmbed(interaction, type) {
  let data;
  console.log(interaction);

  return;
  // if interaction = character
  // get characters

  if (interaction.isCommand() || interaction.customId === "return-roster") {
    data = await getCharacters();
  } else {
    //check if char
    if (interaction.componentType === "BUTTON") {
      data = await getCharacterInfo(interaction.customId, null);
      return data;
    }
    if (interaction.customId.substring(0, 4) === "char") {
      data = await getCharacterInfo(interaction.values[0], null);
    } else {
      //if move
      data = await getMoveInfo(
        interaction.message.embeds[0].title,
        interaction.values[0]
      );
    }
  }

  // else
  // get character info

  return data;
}

async function generateCharacterEmbed() {}

async function generateGameEmbed() {}

async function generateMoveEmbed() {}

module.exports = { generateEmbed };
