const mongoose = require("mongoose");

const databaseUrl = `mongodb+srv://${process.env.user}:${process.env.password}@${process.env.hostName}/${process.env.dbName}?retryWrites=true&w=majority&authSource=admin`;

const dataBaseConnect = async () => {
  await mongoose.connect(databaseUrl);
};
module.exports = { dataBaseConnect };
