const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../src/model/user");
const { default: axios } = require("axios");
dotenv.config();

(async () => {
  try {
    const adminConnect = new mongoose.mongo.MongoClient(process.env.url);
    await adminConnect.connect();
    console.log("Admin is connected.");
    const databaseUrl = `mongodb+srv://${process.env.user}:${process.env.password}@${process.env.hostName}/${process.env.dbName}?retryWrites=true&w=majority&authSource=admin`;
    console.log(databaseUrl);
    const connectDb = new mongoose.mongo.MongoClient(databaseUrl);
    try {
      await connectDb.connect();
      console.log("Database is connected.");
    } catch (error) {
      if (error.message.includes(process.env.auth)) {
        console.log("start");
        // const db = adminConnect.db(process.env.dbName);
        // await db.command({
        //   createUser: process.env.user,
        //   pwd: process.env.password,
        //   roles: ["dbOwner"],
        // });
        // await mongoose.connect(databaseUrl);
        const { ATLAS_PUBLIC_KEY, ATLAS_PRIVATE_KEY, ATLAS_PROJECT_ID } =
          process.env;

        const auth = {
          username: ATLAS_PUBLIC_KEY,
          password: ATLAS_PRIVATE_KEY,
        };

        const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${ATLAS_PROJECT_ID}/databaseUsers`;

        // Try with readWrite role first
        let newUser = {
          databaseName: "admin", // Always admin for Atlas
          roles: [{ databaseName: process.env.dbName, roleName: "readWrite" }],
          username: process.env.user,
          password: process.env.password,
        };

        const DigestFetch = (await import("digest-fetch")).default;
        const client = new DigestFetch(ATLAS_PUBLIC_KEY, ATLAS_PRIVATE_KEY);
        try {
          const res = await client.fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          });

          const data = await res.json();
          console.log("📌 Atlas API response:", data);

          if (data.error) {
            throw new Error(data.detail || "Failed to create user");
          }
          console.log("⏳ Waiting 30 seconds for user to propagate...");
          await new Promise((resolve) => setTimeout(resolve, 30000));

          // Try connecting again
          await mongoose.connect(databaseUrl);
          console.log("✅ Connected after creating user!");
          await User.insertMany([
            { firstName: "Manan", lastName: "Vaghasiya", gender: "male" },
          ]);
          console.log("🎉 Sample data inserted!");
        } catch (err) {
          throw new Error(err.message);
        }
      } else {
        throw new Error(error.message);
      }
    } finally {
      setTimeout(() => process.exit(0), 1000);
    }
  } catch (error) {
    console.log(error.message);
  }
})();
