const {
  generateEmbed,
  generateGameListEmbed,
  generateCharacterEmbed,
  generateRosterEmbed,
  generatePageChange,
  generateMoveEmbed,
  generateSysEmbed,
} = require("./helpers/generateEmbed");

const {
  updateCharacterData,
  getCharacters,
  getCharacter,
  getInfo,
  getMoveset,
} = require("./database/queries");

const {
  actionRowGenerator,
  sortMoves,
  sortCharacters,
  characterRowGenerator,
  gameListRowGenerator,
} = require("./helpers/generators");

async function massTestCharacterEmbed(data) {
  const characters = await getCharacters(data.game);

  for (let i = 0; i < characters.length; i++) {
    try {
      data.character = characters[i].name;
      const result = await generateCharacterEmbed(data);
      await massTestMoveEmbed(result);
    } catch (error) {
      console.log(data);
      console.log(error);
    }
  }
  console.log("Done!" + "-" + data.game);
}

async function massTestMoveEmbed(data) {
  const flatList = data.sortedMoveset.flat();
  for (let i = 0; i < flatList.length; i++) {
    for (let j = 0; j < flatList[i].moveList.length; j++) {
      if (flatList[i].moveType !== "System Data") {
        data.move = flatList[i].moveList[j];
        await generateMoveEmbed(data);
      }
    }
  }
}

module.exports = { massTestCharacterEmbed };
