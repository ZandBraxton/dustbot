const fetch = require("node-fetch");
const dummydata = require("../commands/dummydata.json");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { execute } = require("../commands/beep");

module.exports = {
  data: new SlashCommandBuilder().setName("base").setDescription("hi there"),
  async execute(character) {
    const result = await fetch(
      `https://www.fgc.guide/apis/v1/characters/${character}`
    );
    const data = await result.json();

    let normals = data.character.characterInfo.normals;
    let specialMoves = data.character.characterInfo.specials;
    let assists = data.character.characterInfo.assists;

    const normalRow = new MessageSelectMenu()
      .setCustomId("normal-row")
      .setPlaceholder("Normals");

    for (const data of normals) {
      normalRow.addOptions({
        label: `${data.moveInfo.input}`,
        value: `${data.moveInfo.input}`,
        default: false,
      });
    }

    const specialMoveRow = new MessageSelectMenu()
      .setCustomId("special-row")
      .setPlaceholder("Special Moves");

    for (const data of specialMoves) {
      specialMoveRow.addOptions({
        label: `${data.moveInfo.input}`,
        value: `${data.moveInfo.input}`,
        default: false,
      });
    }

    const assistRow = new MessageSelectMenu()
      .setCustomId("assist-row")
      .setPlaceholder("Assists");

    for (const data of assists) {
      assistRow.addOptions({
        label: `${data.name} | Type ${data.type}`,
        value: `${data.name} | Type ${data.type}`,
        default: false,
      });
    }

    const characterInfoEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${data.character.id}`)
      .setDescription("placeholder");

    console.log(normals);
  },
};
