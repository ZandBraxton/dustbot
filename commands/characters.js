const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
} = require("discord.js");
// const { request } = require("undici");
const fetch = require("node-fetch");
const dummydata = require("./dummydata.json");

const { getCharacters } = require("../helpers/getCharacters");
const { getCharacterInfo } = require("../helpers/getCharacterInfo");
const { generateEmbed } = require("../helpers/generateEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("placeholder")
    .setDescription("placeholder"),
  async execute(interaction) {
    // const result = await fetch("https://www.fgc.guide/apis/v1/characters");
    // const data = await result.json();
    // console.log(interaction);
    // const data = await getCharacters();
    // console.log(interaction.isCommand());
    const data = await generateEmbed(interaction);

    interaction.reply({
      embeds: [data.embed],
      components: data.component,
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: ({ user }) => user.id === interaction.user.id,
    });

    collector.on("collect", async (interaction) => {
      console.log(interaction);
      await generateEmbed(interaction);
      const data = await generateEmbed(interaction);

      await interaction.update({
        embeds: [data.embed],
        components: data.component,
      });
    });
  },
};

// components: [
//   new MessageActionRow({
//     components: [
//       // back button if it isn't the start
//       ...(currentIndex ? [backButton] : []),
//       // forward button if it isn't the end
//       ...(currentIndex + 10 < result.length ? [forwardButton] : []),
//     ],
//   }),
// ],

// if (command === "leaderboard") {
//   const result = await fetch(
//     "https://www.fgc.guide/apis/v1/characters/goku-ssj"
//   );
//   const data = await result.json();

//   const generateEmbed = async (start) => {
//     // You can of course customise this embed however you want
//     return new MessageEmbed({
//       title: `${data.character.id}`,
//     });
//   };

//   // Send the embed with the first 10 guilds
//   const canFitOnOnePage = result.length <= 10;
//   const embedMessage = await message.channel.send({
//     embeds: [await generateEmbed(0)],
//     components: canFitOnOnePage
//       ? []
//       : [new MessageActionRow({ components: [forwardButton] })],
//   });
//   // Exit if there is only one page of guilds (no need for all of this)

// Collect button interactions (when a user clicks a button),
// but only when the button as clicked by the original message author
// const collector = embedMessage.createMessageComponentCollector({
//   filter: ({ user }) => user.id === message.author.id,
// });

//   let currentIndex = 0;
//   collector.on("collect", async (interaction) => {
//     // Increase/decrease index
//     interaction.customId === backId
//       ? (currentIndex -= 10)
//       : (currentIndex += 10);
//     // Respond to interaction by updating message with new embed
//     await interaction.update({
//       embeds: [await generateEmbed(currentIndex)],
//       components: [
//         new MessageActionRow({
//           components: [
//             // back button if it isn't the start
//             ...(currentIndex ? [backButton] : []),
//             // forward button if it isn't the end
//             ...(currentIndex + 10 < result.length ? [forwardButton] : []),
//           ],
//         }),
//       ],
//     });
//   });
// }
