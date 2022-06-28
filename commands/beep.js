const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
} = require("discord.js");
// const { request } = require("undici");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("goku")
    .setDescription("Replies with Bop!"),
  async execute(interaction) {
    const result = await fetch(
      "https://www.fgc.guide/apis/v1/characters/goku-ssj"
    );
    const data = await result;
    // console.log(data.character.characterInfo);
    let normals = data.character.characterInfo.normals;
    let specialMoves = data.character.characterInfo.specials;
    let assists = data.character.characterInfo.assists;
    // console.log(assists);
    // console.log(normals);
    // for (const data of normals) {
    //   console.log(data.moveInfo.input);
    // }
    // .then((body) => console.log(body));
    // console.log(result);
    // const { file } = await getJSONResponse(result.body);
    // console.log(file);

    const normalRow = new MessageSelectMenu()
      .setCustomId("normal-row")
      .setPlaceholder("Normals");

    for (const data of normals) {
      normalRow.addOptions({
        label: `${data.moveInfo.input}`,
        value: `${data.moveInfo.input}`,
        default: false,
      });
    }

    const specialMoveRow = new MessageSelectMenu()
      .setCustomId("special-row")
      .setPlaceholder("Special Moves");

    for (const data of specialMoves) {
      specialMoveRow.addOptions({
        label: `${data.moveInfo.input}`,
        value: `${data.moveInfo.input}`,
        default: false,
      });
    }

    const assistRow = new MessageSelectMenu()
      .setCustomId("assist-row")
      .setPlaceholder("Assists");

    for (const data of assists) {
      assistRow.addOptions({
        label: `${data.name} | Type ${data.type}`,
        value: `${data.name} | Type ${data.type}`,
        default: false,
      });
    }

    const exampleEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${data.character.id}`)
      .setDescription("placeholder")
      .setThumbnail(
        `http://www.dustloop.com/wiki/images/thumb/8/87/DBFZ_SS_Goku_Icon.png/81px-DBFZ_SS_Goku_Icon.png`
      );

    interaction.reply({
      embeds: [exampleEmbed],
      components: [
        new MessageActionRow({
          components: [normalRow],
        }),
        new MessageActionRow({
          components: [specialMoveRow],
        }),
        new MessageActionRow({
          components: [assistRow],
        }),
      ],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: ({ user }) => user.id === interaction.user.id,
    });

    collector.on("collect", async (interaction) => {
      // Increase/decrease index
      console.log(normals);
      console.log(interaction.customId);
      console.log(interaction.user.id);
      console.log(interaction.values[0]);
      // interaction.customId === backId
      //   ? (currentIndex -= 10)
      //   : (currentIndex += 10);
      // Respond to interaction by updating message with new embed
      // await interaction.update({
      //   embeds: [await generateEmbed(currentIndex)],
      //   components: [
      //     new MessageActionRow({
      //       components: [
      //         // back button if it isn't the start
      //         ...(currentIndex ? [backButton] : []),
      //         // forward button if it isn't the end
      //         ...(currentIndex + 10 < result.length ? [forwardButton] : []),
      //       ],
      //     }),
      //   ],
      // });
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
