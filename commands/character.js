const { SlashCommandBuilder } = require("@discordjs/builders");

const {
  generateEmbed,
  generateCharacterEmbed,
} = require("../helpers/generateEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Get info on a character from a selected game")
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

    let data = {
      embed: null,
      components: null,
      pageIndex: 0,
      game: game,
      character: character,
      sortedMoveset: null,
      move: null,
    };

    await generateCharacterEmbed(data);

    await interaction.reply({
      embeds: [data.embed],
      components: data.components,
    });
    const reply = await interaction.fetchReply();

    const filter = (i) => {
      return i.user.id === interaction.user.id;
    };

    const collector = await reply.createMessageComponentCollector({
      filter,
    });
    collector.on("collect", async (i) => {
      try {
        data = await generateEmbed(i, data);
      } catch (error) {
        // console.log(data.game);
        // console.log(data.character.name);
        // console.log(data.move);
        console.log(error);
      }
    });
  },
};
