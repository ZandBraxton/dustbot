const { SlashCommandBuilder } = require("@discordjs/builders");

const {
  generateEmbed,
  generateCharacterEmbed,
  generateMoveEmbed,
} = require("../helpers/generateEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move")
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
    )
    .addStringOption((option) =>
      option
        .setName("move-type")
        .setDescription("Select the move type")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("move")
        .setDescription("Select the move")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async execute(interaction) {
    const character = interaction.options.getString("character-name");
    const game = interaction.options.getString("game");
    const moveType = interaction.options.getString("move-type");
    const moveName = interaction.options.getString("move");

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

    //Have to generate character embed to easily navigate to move embed
    await generateCharacterEmbed(data);
    const flatList = data.sortedMoveset.flat();
    const foundMovelist = flatList.find(
      (list) => list.moveType.substring(0, moveType.length) === moveType
    );

    const move = foundMovelist.moveList.find(
      (move) => move.input === moveName || move.name === moveName
    );
    data.move = move;
    await generateMoveEmbed(data);

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
        console.log(error);
      }
    });
  },
};
