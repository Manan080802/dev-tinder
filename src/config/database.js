const mongoose = require("mongoose");

const databaseUrl = `mongodb://${process.env.user}:${process.env.password}@${process.env.hostName}/${process.env.dbName}`;

const dataBaseConnect = async () => {
  await mongoose.connect(databaseUrl);
};
module.exports = { dataBaseConnect };
