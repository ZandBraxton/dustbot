const fetch = require("node-fetch");
const { updateCharacterData } = require("./queries");

async function massUpdateCharacters() {
  const result = await fetch(`http://127.0.0.1:8000/Guilty_Gear_-Strive-`);
  // const result = await fetch(`http://127.0.0.1:8000/Dragon_Ball_FighterZ`);
  // const result = await fetch(`http://127.0.0.1:8000/BlazBlue:_Central_Fiction`);
  // const result = await fetch(`http://127.0.0.1:8000/BlazBlue_Cross_Tag_Battle`);
  // const result = await fetch(`http://127.0.0.1:8000/Guilty_Gear_Xrd_REV_2`);
  // const result = await fetch(`http://127.0.0.1:8000/Granblue_Fantasy_Versus`);
  // const result = await fetch(`http://127.0.0.1:8000/DNF_Duel`);
  // const result = await fetch(
  //   `http://127.0.0.1:8000/Persona_4:_Arena_Ultimax_2.5`
  // );
  // const result = await fetch(
  //   `http://127.0.0.1:8000/Guilty_Gear_XX_Accent_Core_Plus_R`
  // );

  let characters = await result.json();
  for (let i = 0; i < characters.length; i++) {
    try {
      await updateCharacter(characters[i].path);
    } catch (error) {
      console.error(error);
    }
  }
}

async function updateCharacter(path) {
  const result = await fetch(`http://127.0.0.1:8000/${path}`);
  let data = await result.json();
  if (data.character.game === "P4U2.5") {
    data.character.game = "P4U2";
  }

  try {
    await updateCharacterData(data);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { updateCharacter, massUpdateCharacters };
