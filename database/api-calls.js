const fetch = require("node-fetch");
const { updateCharacterData } = require("./queries");

async function massUpdateCharacters() {
  const result = await fetch(`http://127.0.0.1:8000/Dragon_Ball_FighterZ`);

  let characters = await result.json();
  for (let i = 0; i < characters.length; i++) {
    try {
      await updateCharacter(characters[i].path);
    } catch (error) {
      console.error(error);
    }
  }

  // const game = {
  //   characters: characters,
  // };
}

async function updateCharacter(path) {
  const result = await fetch(`http://127.0.0.1:8000/${path}`);
  let data = await result.json();

  try {
    await updateCharacterData(data);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { updateCharacter, massUpdateCharacters };
