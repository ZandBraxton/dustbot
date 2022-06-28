const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  actionRowGenerator,
  sortData,
  sortCharacters,
  characterRowGenerator,
  generateMoveEmbed,
} = require("../helpers/generators");
const { getCharacter, getCharacters, getInfo } = require("../database/queries");

const { v4: uuidv4 } = require("uuid");
const { generateEmbed } = require("../helpers/generateEmbed");

// const data = require("../bardock.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("games")
    .setDescription("Select a game to return characters from it!")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("Select the game")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async execute(interaction) {
    const game = interaction.options.getString("game");

    const embed = await generateEmbed(interaction, "game");

    const data = await getCharacters(game);

    let sortedArray = await sortCharacters(data);

    const info = await getInfo(game);
    console.log(info);

    // console.log(data);
    let components;
    components = await characterRowGenerator(sortedArray);

    const buttonRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("Return")
        .setLabel("Return to game select")
        .setStyle("SECONDARY")
        .setEmoji("⬅️")
    );

    components.push(buttonRow);

    const gameInfoEmbed = new MessageEmbed()
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

    await interaction.reply({
      embeds: [gameInfoEmbed],
      components: components,
    });
    const reply = await interaction.fetchReply();

    const filter = (i) => {
      return i.user.id === interaction.user.id;
    };

    const collector = await reply.createMessageComponentCollector({
      filter,
    });
    collector.on("collect", async (i) => {
      console.log(i);
      if (i.customId === "return") {
        //return to game select?
      } else {
        //go to character page?
      }
    });
  },
};
