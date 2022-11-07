// Import Packages
const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
//-----------------------------------------

// -------------------- Initializations --------------------
require("dotenv").config(); // dotenv
const app = express(); // express
const { MongoClient, ObjectId } = mongodb;
//-----------------------------------------

// Middleware options
const corsOptions = {
  origin: process.env.CLIENT_ADDRESS || process.env.DEV_CLIENT,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  withCredentials: true,
};
// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
//-----------------------------------------

//------------------- Accessing Secrets --------------------
const PORT = process.env.PORT || process.env.DEV_PORT;
const { DB_URI, DB_NAME } = process.env;
//-----------------------------------------

//---------------- CONNECT MONGODB -------------------

// Collections
let servicesCollection;
let commentsCollection;
//--------------------

MongoClient.connect(DB_URI, function (err, client) {
  if (err) {
    console.error("DB connection failed");
    console.error(err);
  }

  servicesCollection = client.db(DB_NAME).collection("services");
  commentsCollection = client.db(DB_NAME).collection("comments");
  console.log("DB CONNECTED");
});

//-----------------------------------------

// --------------- API END POINTS / Controllers ---------

// Handling GET requests ------------------

/* Get services */
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
// END of Handling GET requests ------------------

// Handling POST requests

/* Post comments */
app.post("/comments", async (req, res) => {
  try {
    const { uid, service_id } = req.headers;

    /*
     * // Body Interface
     * body: {
     *	review: String,
     *
     * }
     *
     */

    const body = req.body;
    const load = { ...body, uid, service_id: ObjectId(service_id) };

    const response = await commentsCollection.insertOne(load);
    response["error"] = false;
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(501).send({ error: true, message: "COMMENT POST FAILED!!" });
  }
});
// END of Handling POST requests ------------------

// Listening to PORT
app.listen(PORT, () => console.log(`SERVER is running at port: ${PORT}`));
