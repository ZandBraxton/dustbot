const client = require("../database/mongodb");

async function updateCharacterData(data) {
  await client.connect();
  await client
    .db(data.character.game)
    .collection("characters")
    .updateOne(
      {
        name: data.character.name,
        game: data.character.game,
        wikiPath: data.character.wikiPath,
      },
      {
        $set: {
          name: data.character.name,
          description: data.character.description,
          game: data.character.game,
          thumbnail: data.character.thumbnail,
          twitterTag: data.character.twitterTag,
          url: data.character.url,
          wikiPath: data.character.wikiPath,
          moveSet: data.moveCollection,
          systemData: data.systemData.length === 0 ? "N/A" : data.systemData,
        },
      },
      { upsert: true }
    );
}

async function getInfo(db) {
  await client.connect();
  const result = await client.db(db).collection("info").findOne();
  return result;
}

async function getCharacters(db) {
  await client.connect();

  const result = await client
    .db(db)
    .collection("characters")
    .find({}, { projection: { name: 1, _id: 0 } })
    .sort({ name: 1 })
    .toArray();

  return result;
}

async function getCharacter(db, character) {
  await client.connect();
  const result = await client.db(db).collection("characters").findOne({
    name: character,
  });

  return result;
}

async function getMoveset(db, character) {
  await client.connect();
  const result = await client
    .db(db)
    .collection("characters")
    .findOne(
      {
        name: character,
      },
      { projection: { moveSet: 1 } }
    );
  return result.moveSet;
}

module.exports = {
  updateCharacterData,
  getCharacters,
  getCharacter,
  getInfo,
  getMoveset,
};
