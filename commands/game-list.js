const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  generateEmbed,
  generateGameListEmbed,
} = require("../helpers/generateEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-list")
    .setDescription("View the list of supported games."),
  async execute(interaction) {
    //cache's data to be used through changing embeds
    let data = {
      embed: null,
      components: null,
      pageIndex: 0,
      game: null,
      character: null,
      sortedMoveset: null,
      move: null,
    };

    await generateGameListEmbed(data);

    await interaction.reply({
      embeds: [data.embed],
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
