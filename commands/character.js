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

    //cache's data to be used through changing embeds
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
