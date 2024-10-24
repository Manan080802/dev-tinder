const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../src/model/user");
dotenv.config();

(async () => {
    try {
      const adminConnect = new mongoose.mongo.MongoClient(process.env.url);
      await adminConnect.connect();
      console.log("Admin is connected.");
      const databaseUrl = `mongodb://${process.env.user}:${process.env.password}@${process.env.hostName}/${process.env.dbName}`;
      console.log(databaseUrl);
      const connectDb = new mongoose.mongo.MongoClient(databaseUrl);
      try {
        await connectDb.connect();
        console.log("Database is connected.");
      } catch (error) {
        if (error.message === process.env.auth) {
          const db = adminConnect.db(process.env.dbName);
          await db.command({
            createUser: process.env.user,
            pwd: process.env.password,
            roles: ["dbOwner"],
          });
          await mongoose.connect(databaseUrl);
          await User.insertMany([
            {
              firstName: "Manan",
              lastName: "Vaghasiya",
              gender: "male",
            },
          ]);
          await mongoose.disconnect();
          console.log("Database is created");
        } else {
          throw new Error(error.message);
        }
      } finally {
        setTimeout(() => process.exit(0), 1000);
      }
    } catch (error) {
      //   console.log('error :>> ', error);
      console.log(error.message);
    }
  })();