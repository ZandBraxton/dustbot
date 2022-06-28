const fetch = require("node-fetch");
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
  generateMoveEmbed,
} = require("../helpers/generators");
const { generateEmbed } = require("../helpers/generateEmbed");
const { getCharacter } = require("../database/queries");

const { v4: uuidv4 } = require("uuid");

// const data = require("../bardock.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Get info on a character")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("Select the game")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("character-name")
        .setDescription("Select the character")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async execute(interaction) {
    const character = interaction.options.getString("character-name");
    const game = interaction.options.getString("game");

    const data = await getCharacter(game, character);
    console.log(data);
    const embed = await generateEmbed(interaction, "game");
    let components;
    let sortedArray = await sortData(data.moveSet);
    console.log(sortedArray.length);

    components = await actionRowGenerator(sortedArray[0]);

    // if (data.moveCollection.length > 4) {
    //   const firstHalf = data.moveCollection.slice(0, 4);
    //   console.log(firstHalf);
    //   components = await actionRowGenerator(firstHalf);
    //   console.log(components);
    // } else {
    //   components = await actionRowGenerator(data.moveCollection);
    // }

    if (sortedArray.length > 1) {
      const buttonRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("more")
          .setLabel("More")
          .setStyle("SECONDARY")
          .setEmoji("➡️")
      );
      components.push(buttonRow);
    }

    const buttonRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("Return")
        .setLabel("Return to character select")
        .setStyle("SECONDARY")
        .setEmoji("⬅️")
    );

    components.push(buttonRow);

    const characterInfoEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${data.name}`)
      .setThumbnail(`${data.thumbnail}`)
      .setDescription(`${data.description}`)
      .setFooter({ text: `Twitter tag | ${data.twitterTag}` })
      .setAuthor({
        name: "Dustloop Page",
        iconURL:
          "https://www.dustloop.com/wiki/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
        url: data.url,
      });

    await interaction.reply({
      embeds: [characterInfoEmbed],
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
      if (i.customId === "more") {
        const more = await actionRowGenerator(sortedArray[1]);
        const buttonRow = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("back")
            .setLabel("Go Back")
            .setStyle("SECONDARY")
            .setEmoji("⬅️")
        );
        more.push(buttonRow);
        await i.deferUpdate();
        await i.editReply({
          embeds: [characterInfoEmbed],
          components: more,
        });
      } else if (i.customId === "back") {
        await i.deferUpdate();
        await i.editReply({
          embeds: [characterInfoEmbed],
          components: components,
        });
      } else {
        //if sorted array is > 1
        const embed = await generateEmbed(i, "game");
        const flatList = sortedArray.flat();
        const foundMovelist = flatList.find(
          (list) => list.moveType === i.customId
        );
        const move = foundMovelist.moveList.find(
          (move) => move.input === i.values[0] || move.name === i.values[0]
        );
        const moveEmbed = await generateMoveEmbed(move, data);
        await i.deferUpdate();
        await i.editReply({
          embeds: [moveEmbed],
        });
      }
    });
  },
};
