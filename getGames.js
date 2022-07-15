require("dotenv").config();
const {
  updateCharacter,
  massUpdateCharacters,
} = require("./database/api-calls");
const { massTestCharacterEmbed } = require("./automatedTest");
const { generateMoveEmbed } = require("./helpers/generators");
const { games } = require("./data/games.json");
const {
  getCharacters,
  getCharacter,
  getMoveset,
} = require("./database/queries");
// let move = {
//   active: "3",
//   airHit: "",
//   blockstun: "15",
//   damage: "400",
//   groundHit: "",
//   guard: "All",
//   image: "https://www.dustloop.com/wiki/images/0/08/DBFZ_Bardock_5L.png",
//   input: "5L",
//   invuln: "",
//   level: "1",
//   onBlock: "-3",
//   prorate: "",
//   recovery: "16",
//   smash: "",
//   startup: "6",
// };

// let character = {
//   game: "DBFZ",
//   name: "Bardock",
//   thumbnail: "https://www.dustloop.com/wiki/images/3/31/DBFZ_Bardock_Icon.png",
//   url: "https://dustloop.com/wiki/index.php?title=DBFZ/Bardock/Frame_Data",
// };

// generateMoveEmbed(move, character);
// updateCharacter("DBFZ/Goku");
// getCharacters("BBTag");
// getMoveset("DBFZ", "Bardock");
// updateCharacter("DBFZ/Videl");
// updateCharacter("DBFZ/Android_16");
// updateCharacter("GGST/Sol_Badguy");
// updateCharacter("GGST/Giovanna");
// updateCharacter("GGST/Leo_Whitefang");
// updateCharacter("BBCF/Ragna_the_Bloodedge");
// updateCharacter("BBTag/Yang_Xiao_Long");
// updateCharacter("BBTag/Mitsuru_Kirijo");
// updateCharacter("BBTag/Rachel_Alucard");
// updateCharacter("GGACR/A.B.A");
// massUpdateCharacters();

// let data = {
//   embed: null,
//   components: null,
//   pageIndex: 0,
//   game: "DBFZ",
//   character: null,
//   sortedMoveset: null,
//   move: null,
// };

games.map((game) => {
  let data = {
    embed: null,
    components: null,
    pageIndex: 0,
    game: game.path,
    character: null,
    sortedMoveset: null,
    move: null,
  };
  massTestCharacterEmbed(data);
});

// massTestCharacterEmbed(data);
