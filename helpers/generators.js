const {
  MessageSelectMenu,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
} = require("discord.js");
const { v4: uuidv4 } = require("uuid");
const templates = require("../data/templates.json");

async function actionRowGenerator(array) {
  const components = [];
  for (let i = 0; i < array.length; i++) {
    const selectRow = new MessageSelectMenu()
      .setCustomId(`move-${array[i].moveType}`)
      .setPlaceholder(`${array[i].moveType}`);

    for (const move of array[i].moveList) {
      let labelOption;
      let valueOption;

      if (move.name && move.input) {
        labelOption = `${move.name} | ${move.input}`;
        valueOption = `${move.input}`;
      } else if (!move.name && move.input) {
        labelOption = `${move.input}`;
        valueOption = `${move.input}`;
      } else if (move.name && !move.input) {
        labelOption = `${move.name}`;
        valueOption = `${move.name}`;
      } else {
        labelOption = "N/A";
        valueOption = uuidv4();
      }

      selectRow.addOptions({
        label: labelOption,
        value: valueOption,
        default: false,
      });
    }

    const row = new MessageActionRow().addComponents(selectRow);
    components.push(row);
  }
  return components;
}

async function characterRowGenerator(array) {
  const components = [];
  for (let i = 0; i < array.length; i++) {
    const firstIndexRange = array[i][0].name.charAt(0);
    const secondIndexRange = array[i][array[i].length - 1].name.charAt(0);
    const selectRow = new MessageSelectMenu()
      .setCustomId(`characters${i}`)
      .setPlaceholder(`Characters ${firstIndexRange} - ${secondIndexRange}`);

    for (const ch of array[i]) {
      selectRow.addOptions({
        label: ch.name,
        value: ch.name,
        default: false,
      });
    }

    const row = new MessageActionRow().addComponents(selectRow);
    components.push(row);
  }
  return components;
}

async function gameListRowGenerator(array) {
  const components = [];
  const selectRow = new MessageSelectMenu()
    .setCustomId("game")
    .setPlaceholder("Games");

  for (const game of array) {
    selectRow.addOptions({
      label: game.title,
      value: game.path,
      default: false,
    });
  }

  const row = new MessageActionRow().addComponents(selectRow);
  components.push(row);
  return components;
}

async function sortData(array) {
  const sortedArray = [];
  array.map((list) => {
    if (list.moveList.length > 25) {
      const firstHalf = list.moveList.slice(0, 25);
      const secondHalf = list.moveList.slice(25);
      sortedArray.push({
        moveList: firstHalf,
        moveType: `${list.moveType} Part 1`,
      });

      sortedArray.push({
        moveList: secondHalf,
        moveType: `${list.moveType} Part 2`,
      });
    } else {
      sortedArray.push(list);
    }
  });

  if (sortedArray.length > 4) {
    const firsHalf = sortedArray.slice(0, 4);
    const secondHalf = sortedArray.slice(4);
    return [firsHalf, secondHalf];
  }

  return [sortedArray];
}

async function sortCharacters(array) {
  const sortedArray = [];
  if (array.length > 25) {
    await splitArray(array, sortedArray);
  } else {
    sortedArray.push(array);
  }
  return sortedArray;
}

async function splitArray(array, sortedArray) {
  const firstHalf = array.slice(0, 25);
  const secondHalf = array.slice(25);
  sortedArray.push(firstHalf);
  if (secondHalf > 25) {
    splitArray(secondHalf, sortedArray);
  } else {
    sortedArray.push(secondHalf);
  }
}

async function generateMoveEmbed(move, character) {
  console.log(move);
  console.log(character);
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${character.name} - ${move.name ? move.name : move.input}`)
    .setThumbnail(character.thumbnail)
    .setAuthor({
      name: "Dustloop Page",
      iconURL:
        "https://www.dustloop.com/wiki/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png",
      url: data.url,
    });

  if (move.name && move.input) {
    embed.setDescription(move.input);
  }

  if (move.image !== "") {
    embed.setImage(move.image);
  }

  const fields = templates[character.game].fields;
  fields.map((field) => {
    embed.addFields({
      name: field.name,
      value: move[field.value] === "" ? "None" : move[field.value],
      inline: field.inline,
    });
  });

  return embed;
}

// async function generateFields(game) {
//   console.log(templates[game]);
// }

module.exports = {
  actionRowGenerator,
  sortData,
  sortCharacters,
  generateMoveEmbed,
  characterRowGenerator,
  gameListRowGenerator,
};
