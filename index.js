// Import Packages
const express = require("express");
const mongodb = require("mongodb");
//-----------------------------------------

// -------------------- Initializations --------------------
require("dotenv").config(); // dotenv
const app = express(); // express
const { MongoClient, ObjectId } = mongodb;
//-----------------------------------------

//------------------- Accessing Secrets --------------------
const PORT = process.env.PORT || process.env.DEV_PORT;
const { DB_URI, DB_NAME } = process.env;
//-----------------------------------------

//---------------- CONNECT MONGODB -------------------

// Collections
let servicesCollection;
//--------------------

MongoClient.connect(DB_URI, function (err, client) {
  if (err) {
    console.error("DB connection failed");
    console.error(err);
  }

  servicesCollection = client.db(DB_NAME).collection("services");
  console.log("DB CONNECTED");
});

//-----------------------------------------

// --------------- API END POINTS / Controllers ---------
app.get("/services", async (req, res) => {
  try {
    const query = {};
    const data = await servicesCollection.find(query).toArray();

    res.status(200).send({
      error: false,
      message: "SERVER is UP and RUnning",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(501).send({ error: true, message: "Query Failed" });
  }
});

// Listening to PORT
app.listen(PORT, () => console.log(`SERVER is running at port: ${PORT}`));
