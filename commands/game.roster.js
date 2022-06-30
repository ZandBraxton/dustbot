const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  generateEmbed,
  generateRosterEmbed,
} = require("../helpers/generateEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-roster")
    .setDescription("Select a game to return its character roster from it!")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("Select the game")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async execute(interaction) {
    const game = interaction.options.getString("game");

    let data = {
      embed: null,
      components: null,
      pageIndex: 0,
      game: game,
      character: null,
      sortedMoveset: null,
      move: null,
    };

    const embed = await generateRosterEmbed(data);

    await interaction.reply({
      embeds: [embed.embed],
      components: embed.components,
    });
    const reply = await interaction.fetchReply();

    const filter = (i) => {
      return i.user.id === interaction.user.id;
    };

    const collector = await reply.createMessageComponentCollector({
      filter,
    });
    collector.on("collect", async (i) => {
      data = await generateEmbed(i, data);
    });
  },
};