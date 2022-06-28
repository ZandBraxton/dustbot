const fetch = require("node-fetch");
const dummydata = require("../commands/dummydata.json");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

async function getCharacterInfo(character, move) {
  console.log(character);
  console.log(move);
  const result = await fetch(
    `https://www.fgc.guide/apis/v1/characters/${character}`
  );
  const data = await result.json();
  const component = [];

  let normals = data.character.characterInfo.normals;
  console.log(normals.length);
  let specialMoves = data.character.characterInfo.specials;
  console.log(specialMoves);
  let assists = data.character.characterInfo.assists;

  const normalRow = new MessageSelectMenu()
    .setCustomId("move-normal-row")
    .setPlaceholder("Normals");

  for (const data of normals) {
    normalRow.addOptions({
      label: `${data.moveInfo.input}`,
      value: `N-${data.moveInfo.input}`,
      default: false,
    });
  }

  component.push(new MessageActionRow({ components: [normalRow] }));

  const specialMoveRow = new MessageSelectMenu()
    .setCustomId("move-special-row")
    .setPlaceholder("Special Moves");

  for (const data of specialMoves) {
    specialMoveRow.addOptions({
      label: `${data.moveInfo.input}`,
      value: `S-${data.moveInfo.input}`,
      default: false,
    });
  }

  component.push(new MessageActionRow({ components: [specialMoveRow] }));

  const assistRow = new MessageSelectMenu()
    .setCustomId("move-assist-row")
    .setPlaceholder("Assists");

  for (const data of assists) {
    assistRow.addOptions({
      label: `${data.name} | Type ${data.type}`,
      value: `A-${data.name}`,
      default: false,
    });
  }

  component.push(new MessageActionRow({ components: [assistRow] }));

  const returnToChar = new MessageButton()
    .setCustomId("return-roster")
    .setLabel("Return to character roster")
    .setStyle("SECONDARY");

  component.push(new MessageActionRow({ components: [returnToChar] }));

  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${data.character.id}`)
    .setDescription("placeholder");

  return { embed, component };
}
// module.exports = { getCharacterInfo };
