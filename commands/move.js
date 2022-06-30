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
    const flatList = data.sortedMoveset.flat();
    const foundMovelist = flatList.find((list) => list.moveType === moveType);
    const move = foundMovelist.moveList.find(
      (move) => move.input === moveName || move.name === moveName
    );
    data.move = move;
    console.log(data);
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
      data = await generateEmbed(i, data);
    });
  },
};