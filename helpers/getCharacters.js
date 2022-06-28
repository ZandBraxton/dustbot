const fetch = require("node-fetch");
const dummydata = require("../commands/dummydata.json");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
} = require("discord.js");

async function getCharacters() {
  const data = await dummydata;
  const component = [];

  const baseRow = new MessageSelectMenu()
    .setCustomId("char-base-row")
    .setPlaceholder("Base Game");

  for (const character of data.characters) {
    baseRow.addOptions({
      label: `${character.id}`,
      value: `${character.id}`,
      default: false,
    });
  }

  component.push(new MessageActionRow({ components: [baseRow] }));

  const s1Row = new MessageSelectMenu()
    .setCustomId("char-s1-row")
    .setPlaceholder("Season 1");

  for (const character of data["season-1"]) {
    s1Row.addOptions({
      label: `${character.id}`,
      value: `${character.id}`,
      default: false,
    });
  }

  component.push(new MessageActionRow({ components: [s1Row] }));

  const s2Row = new MessageSelectMenu()
    .setCustomId("char-s2-row")
    .setPlaceholder("Season 2");

  for (const character of data["season-2"]) {
    s2Row.addOptions({
      label: `${character.id}`,
      value: `${character.id}`,
      default: false,
    });
  }

  component.push(new MessageActionRow({ components: [s2Row] }));

  const s3Row = new MessageSelectMenu()
    .setCustomId("char-s3-row")
    .setPlaceholder("Season 3");

  for (const character of data["season-3"]) {
    s3Row.addOptions({
      label: `${character.id}`,
      value: `${character.id}`,
      default: false,
    });
  }

  component.push(new MessageActionRow({ components: [s3Row] }));

  const s4Row = new MessageSelectMenu()
    .setCustomId("char-s4-row")
    .setPlaceholder("Season 4");

  for (const character of data["season-4"]) {
    s4Row.addOptions({
      label: `${character.id}`,
      value: `${character.id}`,
      default: false,
    });
  }

  component.push(new MessageActionRow({ components: [s4Row] }));

  const embed = new MessageEmbed()
    .setColor("#ed7009")
    .setTitle(`DBFZ Roster`)
    .setThumbnail(`http://www.dustloop.com/wiki/images/0/06/DBFZ_Logo.png`);

  return { embed, component };
}

module.exports = { getCharacters };
