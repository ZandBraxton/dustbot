const fetch = require("node-fetch");
const templates = require("../data/templates.json");
const { games } = require("../data/games.json");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageButton,
  MessageActionRow,
} = require("discord.js");

// const { getCharacters } = require("./getCharacters");
// const { getCharacterInfo } = require("./getCharacterInfo");
// const { getMoveInfo } = require("./getMoveInfo");
const {
  sortData,
  sortCharacters,
  actionRowGenerator,
  characterRowGenerator,
  gameListRowGenerator,
} = require("../helpers/generators");

const { getCharacter, getCharacters, getInfo } = require("../database/queries");

async function generateEmbed(interaction, data) {
  console.log(data);
  // console.log(move);
  // console.log(interaction);

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
    const flatList = data.sortedMoveset.flat();
    const foundMovelist = flatList.find(
      (list) => list.moveType === interaction.customId.substring(5)
    );
    const move = foundMovelist.moveList.find(
      (move) =>
        move.input === interaction.values[0] ||
        move.name === interaction.values[0]
    );
    data.move = move;
    data = await generateMoveEmbed(data);
  }

  console.log(data);
  // if interaction = character
  // get characters

  // if (interaction.isCommand() || interaction.customId === "return-roster") {
  //   data = await getCharacters();
  // } else {
  //   //check if char
  //   if (interaction.componentType === "BUTTON") {
  //     data = await getCharacterInfo(interaction.customId, null);
  //     return data;
  //   }
  //   if (interaction.customId.substring(0, 4) === "char") {
  //     data = await getCharacterInfo(interaction.values[0], null);
  //   } else {
  //     //if move
  //     data = await getMoveInfo(
  //       interaction.message.embeds[0].title,
  //       interaction.values[0]
  //     );
  //   }
  // }

  // else
  // get character info

  // return data;
  await interaction.deferUpdate();
  await interaction.editReply({
    embeds: [data.embed],
    components: data.components,
  });
  return data;
}

async function generateGameListEmbed(data) {
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`Game list`)
    .setDescription("placeholder")
    .setAuthor({
      name: "Dustloop Wiki",
      iconURL:
        "https://www.dustloop.com/wiki/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: "https://www.dustloop.com/wiki/index.php?title=Main_Page",
    });

  const components = await gameListRowGenerator(games);
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
  components.push(buttonRow);

  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${info.title}`)
    .setThumbnail(`${info.thumbnail}`)
    .setDescription(`${info.description}`)
    .setAuthor({
      name: "Dustloop Page",
      iconURL:
        "https://www.dustloop.com/wiki/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: info.url,
    });

  console.log(embed);
  data.embed = embed;
  data.components = components;
  data.pageIndex = 0;

  return data;
}

async function generateCharacterEmbed(data) {
  const result = await getCharacter(data.game, data.character);
  const sortedMoveset = await sortData(result.moveSet);

  const components = await actionRowGenerator(sortedMoveset[0]);

  const buttonRow = new MessageActionRow();

  const returnButton = new MessageButton()
    .setCustomId("game")
    .setLabel("Return to character select")
    .setStyle("SECONDARY")
    .setEmoji("⬅️");

  buttonRow.addComponents(returnButton);
  if (sortedMoveset.length > 1) {
    const nextButton = new MessageButton()
      .setCustomId("ch-next")
      .setLabel("Show More")
      .setStyle("PRIMARY")
      .setEmoji("➡️");
    buttonRow.addComponents(nextButton);
  }

  components.push(buttonRow);

  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${result.name}`)
    .setThumbnail(`${result.thumbnail}`)
    .setDescription(`${result.description}`)
    .setFooter({ text: `Twitter tag | ${result.twitterTag}` })
    .setAuthor({
      name: "Dustloop Page",
      iconURL:
        "https://www.dustloop.com/wiki/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: result.url,
    });
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
    const prevButton = new MessageButton()
      .setCustomId("ch-prev")
      .setLabel("Go Back")
      .setStyle("PRIMARY")
      .setEmoji("⬅️");
    buttonRow.addComponents(prevButton);
  }

  //if there is a pnext page
  if (data.sortedMoveset[data.pageIndex + 1] !== undefined) {
    const nextButton = new MessageButton()
      .setCustomId("ch-next")
      .setLabel("Show More")
      .setStyle("PRIMARY")
      .setEmoji("➡️");
    buttonRow.addComponents(nextButton);
  }

  components.push(buttonRow);

  data.components = components;

  return data;
}

async function generateMoveEmbed(data) {
  console.log(data.move);
  console.log(data.character);
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(
      `${data.character.name} - ${
        data.move.name ? data.move.name : data.move.input
      }`
    )
    .setThumbnail(data.character.thumbnail)
    .setAuthor({
      name: "Dustloop Page",
      iconURL:
        "https://www.dustloop.com/wiki/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: data.character.url,
    });

  if (data.move.name && data.move.input) {
    embed.setDescription(data.move.input);
  }

  if (data.move.image !== "") {
    embed.setImage(data.move.image);
  }

  console.log(templates[data.game]);

  const fields = templates[data.character.game].fields;
  fields.map((field) => {
    embed.addFields({
      name: field.name,
      value: data.move[field.value] === "" ? "None" : data.move[field.value],
      inline: field.inline,
    });
  });

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
};
