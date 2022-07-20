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

    //cache's data to be used through changing embeds
    let data = {
      embed: null,
      components: null,
      pageIndex: 0,
      game: game,
      character: null,
      sortedMoveset: null,
      move: null,
    };

    await generateRosterEmbed(data);

    await interaction.reply({
      embeds: [data.embed],
      // components: data.components,
    });
    const componentReply = await interaction.followUp({
      components: data.components,
      ephemeral: true,
    });
    const reply = await interaction.fetchReply();

    const filter = (i) => {
      return i.user.id === interaction.user.id;
    };

    try {
      const collector = await componentReply.createMessageComponentCollector({
        filter,
      });
      collector.on("collect", async (i) => {
        try {
          data = await generateEmbed(i, data, reply);
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
};
