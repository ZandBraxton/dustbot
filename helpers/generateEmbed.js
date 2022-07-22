const templates = require("../data/templates.json");
const { games } = require("../data/games.json");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

const {
  sortMoves,
  sortCharacters,
  actionRowGenerator,
  characterRowGenerator,
  gameListRowGenerator,
} = require("../helpers/generators");

const { getCharacter, getCharacters, getInfo } = require("../database/queries");
//finds values stored inside round brackets
const reBrackets = /\(([^)]+)\)/;

const closeButton = new MessageButton()
  .setCustomId("close")
  .setLabel("Close")
  .setStyle("DANGER");

const nextButton = new MessageButton()
  .setCustomId("ch-next")
  .setLabel("Show More")
  .setStyle("PRIMARY")
  .setEmoji("➡️");

const prevButton = new MessageButton()
  .setCustomId("ch-prev")
  .setLabel("Go Back")
  .setStyle("PRIMARY")
  .setEmoji("⬅️");

//General function that decides which embed to be called
async function generateEmbed(interaction, data, message) {
  if (interaction.customId === "close") {
    await message.deleteReply();
    return;
  }

  if (interaction.customId === "game-list") {
    data = await generateGameListEmbed(data);
  }

  if (interaction.customId === "game") {
    if (interaction.values) {
      data.game = interaction.values[0];
    }
    data = await generateRosterEmbed(data);
  }

  if (interaction.customId.substring(0, 4) === "char") {
    data.character = interaction.values[0];
    data = await generateCharacterEmbed(data);
  }

  if (
    interaction.customId === "ch-next" ||
    interaction.customId === "ch-prev"
  ) {
    interaction.customId === "ch-next" ? data.pageIndex++ : data.pageIndex--;
    data = await generatePageChange(data);
  }

  if (interaction.customId.substring(0, 4) === "move") {
    let moveTypeCheck = reBrackets.exec(interaction.customId);
    //grabs value inside of round brackets
    let moveCheck = reBrackets.exec(interaction.values[0]);

    const flatList = data.sortedMoveset.flat();
    const foundMovelist = flatList.find(
      (list) => list.moveType === moveTypeCheck[1]
    );
    const move = foundMovelist.moveList.find(
      (move) => move.input === moveCheck[1] || move.name === moveCheck[1]
    );
    data.move = move;
    data = await generateMoveEmbed(data);
  }
  if (interaction.customId.substring(0, 3) === "sys") {
    await generateSysEmbed(data, interaction.values[0]);
  }

  await interaction.deferUpdate();
  //public embed
  await message.editReply({
    embeds: [data.embed],
  });
  //ephemeral selection rows/buttons
  await interaction.editReply({
    components: data.components,
  });
  return data;
}

async function generateGameListEmbed(data) {
  const embed = new MessageEmbed()
    .setColor("#ee121b")
    .setTitle(`Game list`)
    .setDescription("List of games currently supported by Dustbot")
    .setAuthor({
      name: "Dustloop Wiki",
      iconURL:
        "https://www.dustloop.com/w/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: "https://www.dustloop.com/w/Main_Page",
    });

  const components = await gameListRowGenerator(games);
  const buttonRow = new MessageActionRow().addComponents(closeButton);
  components.push(buttonRow);
  data.embed = embed;
  data.components = components;
  return data;
}

async function generateRosterEmbed(data) {
  const result = await getCharacters(data.game);
  const info = await getInfo(data.game);
  const sortedCharacters = await sortCharacters(result);
  const components = await characterRowGenerator(sortedCharacters);
  const buttonRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("game-list")
      .setLabel("Return to game select")
      .setStyle("SECONDARY")
      .setEmoji("⬅️")
  );
  buttonRow.addComponents(closeButton);
  components.push(buttonRow);

  const embed = new MessageEmbed()
    .setColor(info.color)
    .setTitle(`${info.title}`)
    .setThumbnail(`${info.thumbnail}`)
    .setDescription(`${info.description}`)
    .setAuthor({
      name: "Dustloop Page",
      iconURL:
        "https://www.dustloop.com/w/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: info.url,
    });

  data.embed = embed;
  data.components = components;
  data.pageIndex = 0;

  return data;
}

async function generateCharacterEmbed(data) {
  const result = await getCharacter(data.game, data.character);
  const info = await getInfo(data.game);

  const sortedMoveset = await sortMoves(result.moveSet, result.systemData);

  const components = await actionRowGenerator(sortedMoveset[data.pageIndex]);

  const buttonRow = new MessageActionRow();

  const returnButton = new MessageButton()
    .setCustomId("game")
    .setLabel("Return to character select")
    .setStyle("SECONDARY")
    .setEmoji("⬅️");

  buttonRow.addComponents(returnButton);
  if (sortedMoveset.length > 1) {
    buttonRow.addComponents(nextButton);
  }

  buttonRow.addComponents(closeButton);

  components.push(buttonRow);

  const twitterTag = result.twitterTag.join("\n");

  const embed = new MessageEmbed()
    .setColor(info.color)
    .setTitle(`${result.name}`)
    .setThumbnail(`${result.thumbnail}`)
    .setFooter({
      text: `Twitter tag | ${twitterTag === "" ? "N/A" : twitterTag}`,
    })
    .setAuthor({
      name: "Dustloop Page",
      iconURL:
        "https://www.dustloop.com/w/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: result.url,
    });

  //data that doesn't need to be cached
  delete result.moveSet;

  data.embed = embed;
  data.components = components;
  data.sortedMoveset = sortedMoveset;
  data.character = result;

  return data;
}

async function generatePageChange(data) {
  const components = await actionRowGenerator(
    data.sortedMoveset[data.pageIndex]
  );
  const buttonRow = new MessageActionRow();

  const returnButton = new MessageButton()
    .setCustomId("game")
    .setLabel("Return to character select")
    .setStyle("SECONDARY")
    .setEmoji("⬅️");

  buttonRow.addComponents(returnButton);

  //if there is a prev page
  if (data.sortedMoveset[data.pageIndex - 1] !== undefined) {
    buttonRow.addComponents(prevButton);
  }

  //if there is a next page
  if (data.sortedMoveset[data.pageIndex + 1] !== undefined) {
    buttonRow.addComponents(nextButton);
  }

  buttonRow.addComponents(closeButton);

  components.push(buttonRow);

  data.components = components;

  return data;
}

async function generateMoveEmbed(data) {
  const info = await getInfo(data.game);
  const embed = new MessageEmbed()
    .setColor(info.color)
    .setTitle(
      `${data.character.name} - ${
        data.move.name ? data.move.name : data.move.input
      }`
    )
    .setThumbnail(data.character.thumbnail)
    .setAuthor({
      name: "Dustloop Page",
      iconURL:
        "https://www.dustloop.com/w/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: data.character.url,
    });

  if (data.move.name && data.move.input) {
    embed.setDescription(data.move.input);
  }

  if (data.move.image !== "") {
    embed.setImage(data.move.image);
  } else {
    embed.setFooter({
      text: "No image to display",
    });
  }

  const fields = templates[data.character.game].fields;
  fields.map((field) => {
    if (data.move[field.value] !== undefined) {
      embed.addFields({
        name: field.name,
        value: data.move[field.value] === "" ? "-" : data.move[field.value],
        inline: field.inline,
      });
    }
  });

  data.embed = embed;
  return data;
}

async function generateSysEmbed(data, key) {
  const info = await getInfo(data.game);
  const found = data.character.systemData.find((el) => el.title === key);

  const embed = new MessageEmbed()
    .setColor(info.color)
    .setTitle(`${key}`)
    .setThumbnail(data.character.thumbnail)
    .setAuthor({
      name: "Dustloop Page",
      iconURL:
        "https://www.dustloop.com/w/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: data.character.url,
    });
  const fields = {};

  found.data.map((object) => {
    for (const prop in object) {
      let value = object[prop] === "" ? "-" : object[prop];
      if (fields[prop]) {
        fields[prop].push(value);
      } else {
        fields[prop] = [];
        fields[prop].push(value);
      }
    }
  });

  if (fields["Name"]) {
    embed.addFields({
      name: "Name",
      value: fields["Name"].join("\n"),
    });
  }

  for (const prop in fields) {
    if (prop !== "Name") {
      embed.addFields({
        name: prop,
        value: fields[prop].join("\n"),
        inline: true,
      });
    }
  }

  data.embed = embed;
  return data;
}

module.exports = {
  generateEmbed,
  generateGameListEmbed,
  generateCharacterEmbed,
  generateRosterEmbed,
  generatePageChange,
  generateMoveEmbed,
  generateSysEmbed,
};
