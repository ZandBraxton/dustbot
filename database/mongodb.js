// require("dotenv").config({ path: "../.env" });

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

module.exports = client;
