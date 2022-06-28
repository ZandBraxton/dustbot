const fetch = require("node-fetch");
const dummydata = require("../commands/dummydata.json");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

async function getMoveInfo(character, move) {
  const result = await fetch(
    `https://www.fgc.guide/apis/v1/characters/${character}`
  );
  const data = await result.json();
  const component = [];

  let moveData;

  let moveType = move.substring(0, 1);
  let moveInput = move.substring(2);

  switch (moveType) {
    case "N":
      moveData = data.character.characterInfo.normals.find(
        (move) => move.moveInfo.input === moveInput
      );
      break;

    case "S":
      moveData = data.character.characterInfo.specials.find(
        (move) => move.moveInfo.input === moveInput
      );

      break;

    case "A":
      moveData = data.character.characterInfo.assists.find(
        (move) => move.moveInfo.input === moveInput
      );

      break;

    default:
      break;
  }

  const returnToMove = new MessageButton()
    .setCustomId(`${character}`)
    .setLabel("Return to movelist")
    .setStyle("SECONDARY");

  component.push(new MessageActionRow({ components: [returnToMove] }));

  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${character} - ${moveData.moveInfo.input}`)
    .setDescription("placeholder")
    .addFields(
      {
        name: "Damage",
        value: moveData.moveInfo.damage,
        inline: true,
      },
      {
        name: "Startup",
        value: moveData.moveInfo.frameData.startup,
        inline: true,
      },
      {
        name: "Active",
        value: moveData.moveInfo.frameData.active,
        inline: true,
      }
    )
    .addFields(
      {
        name: "Recovery",
        value: moveData.moveInfo.frameData.recovery,
        inline: true,
      },
      {
        name: "Advantage",
        value: moveData.moveInfo.frameData.advantage,
        inline: true,
      },
      {
        name: "Guard",
        value: moveData.moveInfo.guard,
        inline: true,
      }
    );

  return { embed, component };
}
module.exports = { getMoveInfo };
