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
    const selectRow = new MessageSelectMenu();
    if (array[i].moveType === "System Data") {
      selectRow.setCustomId(`sys`).setPlaceholder(`${array[i].moveType}`);
      for (const obj of array[i].moveList) {
        selectRow.addOptions({
          label: obj.title,
          value: obj.title,
        });
      }
    } else {
      selectRow
        .setCustomId(`move-(${array[i].moveType})` + uuidv4())
        .setPlaceholder(`${array[i].moveType}`);

      for (const move of array[i].moveList) {
        let labelOption;
        let valueOption;

        if (move.name && move.input) {
          if (move.name === move.input) {
            labelOption = `${move.input}`;
            valueOption = `(${move.input})` + uuidv4();
          } else {
            labelOption = `${move.name} | ${move.input}`;
            valueOption = `(${move.input})` + uuidv4();
          }
        } else if (!move.name && move.input) {
          labelOption = `${move.input}`;
          valueOption = `(${move.input})` + uuidv4();
        } else if (move.name && !move.input) {
          labelOption = `${move.name}`;
          valueOption = `(${move.name})` + uuidv4();
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

async function sortMoves(array, systemData) {
  const sortedArray = [];
  if (systemData !== "N/A") {
    sortedArray.push({
      moveList: systemData,
      moveType: "System Data",
    });
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i].moveList.length > 25) {
      const tempSortedArray = [];
      await splitArray(array[i].moveList, tempSortedArray, 25);
      for (let j = 0; j < tempSortedArray.length; j++) {
        sortedArray.push({
          moveList: tempSortedArray[j],
          moveType: `${array[i].moveType} Part ${j + 1}`,
        });
      }
    } else {
      sortedArray.push(array[i]);
    }
  }

  if (sortedArray.length > 4) {
    const slicedArray = [];
    await splitArray(sortedArray, slicedArray, 4);
    return slicedArray;
  }

  return [sortedArray];
}

async function sortCharacters(array) {
  const sortedArray = [];
  if (array.length > 25) {
    await splitArray(array, sortedArray, 25);
  } else {
    sortedArray.push(array);
  }
  return sortedArray;
}

async function splitArray(array, sortedArray, endIndex) {
  const firstHalf = array.slice(0, endIndex);
  const secondHalf = array.slice(endIndex);
  sortedArray.push(firstHalf);
  if (secondHalf.length > endIndex) {
    splitArray(secondHalf, sortedArray, endIndex);
  } else {
    sortedArray.push(secondHalf);
  }
}

module.exports = {
  actionRowGenerator,
  sortMoves,
  sortCharacters,
  characterRowGenerator,
  gameListRowGenerator,
};
