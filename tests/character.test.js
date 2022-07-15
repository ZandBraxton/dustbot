require("dotenv").config();
const fetch = require("node-fetch");
const matchers = require("jest-extended");
expect.extend(matchers);
const {
  generateEmbed,
  generateGameListEmbed,
  generateCharacterEmbed,
  generateRosterEmbed,
  generatePageChange,
  generateMoveEmbed,
  generateSysEmbed,
} = require("../helpers/generateEmbed");

const {
  updateCharacterData,
  getCharacters,
  getCharacter,
  getInfo,
  getMoveset,
} = require("../database/queries");

const {
  actionRowGenerator,
  sortMoves,
  sortCharacters,
  characterRowGenerator,
  gameListRowGenerator,
} = require("../helpers/generators");

// let game = "DBFZ";
// let character = "Bardock";

const cases = [
  ["DBFZ", "Bardock"],
  ["DBFZ", "Master Roshi"],
  ["DBFZ", "Captain Ginyu"],
];

describe.each(cases)("generates character embed", (game, character) => {
  let result;
  let sortedMoveset;
  beforeAll(async () => {
    result = await getCharacter(game, character);
    sortedMoveset = await sortMoves(result.moveSet, result.systemData);
  });

  it("should get character name", async () => {
    expect(result.name).toBe(character);
  });

  it("should check if image is valid", async () => {
    await fetch(result.thumbnail, { method: "HEAD" }).then((res) => {
      expect(res.status).toBe(200);
    });
  });

  it("should check if moveset types are unique", async () => {
    const moveTypes = [];
    result.moveSet.map((array) => {
      expect(moveTypes).not.toContain(array.moveType);
      moveTypes.push(array.moveType);
    });
  });

  describe("Check sorted moveset", () => {
    it("should check if nested movesets are cut into arrays of 4", async () => {
      sortedMoveset.map((array) => {
        expect(array.length).toBeLessThanOrEqual(4);
      });
    });

    it("should check if moveset types are unique", async () => {
      const moveTypes = [];
      sortedMoveset.map((moveSet) => {
        moveSet.map((moveSetData) => {
          expect(moveTypes).not.toContain(moveSetData.moveType);
          moveTypes.push(moveSetData.moveType);
        });
      });
    });

    it("should check if nested movesets are a length of 25 or less", async () => {
      sortedMoveset.map((moveSet) => {
        moveSet.map((moveSetData) => {
          expect(moveSetData.moveList.length).toBeLessThanOrEqual(25);
        });
      });
    });
  });
});
