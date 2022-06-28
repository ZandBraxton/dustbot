require("dotenv").config();
const {
  updateCharacter,
  massUpdateCharacters,
} = require("./database/api-calls");
const { generateMoveEmbed } = require("./helpers/generators");
const { getCharacters, getCharacter } = require("./database/queries");
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
// updateCharacter("DBFZ/Videl");
getCharacters("DBFZ");
getCharacter("DBFZ", "Bardock");

// massUpdateCharacters();
