// Import Packages
const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
//-----------------------------------------

// -------------------- Initializations --------------------
require("dotenv").config(); // dotenv
const app = express(); // express
const { MongoClient, ServerApiVersion, ObjectId } = mongodb;
//-----------------------------------------

// Middleware options
/*
const corsOptions = {
  origin: process.env.CLIENT_ADDRESS || process.env.DEV_CLIENT,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  withCredentials: true,
};
*/

// Middlewares
app.use(express.json());
app.use(cors());
//-----------------------------------------

//------------------- Accessing Secrets --------------------
const PORT = process.env.PORT || process.env.DEV_PORT;
const { DB_URI, DB_NAME, SECRET_JWT } = process.env;
//-----------------------------------------

//---------------- Middleware Functions -------------------

// Authorization Middleware
const authGuard = async (req, res, next) => {
  const { authtoken } = req.headers;
  try {
    const decoded = jwt.verify(authtoken, SECRET_JWT);
    if (decoded) {
      res.decoded = {};
      res.decoded = decoded;
      next();
    } else {
      res
        .status(403)
        .send({ error: true, message: "Unauthorized action attempted" })
        .end();
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(403)
      .send({ error: true, message: "Auth-z failed. Invalid Token" })
      .end();
  }
};
//-----------------------------------------

//---------------- CONNECT MONGODB -------------------

const client = new MongoClient(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// //
async function run() {
  try {
    const servicesCollection = client.db(DB_NAME).collection("services");
    const commentsCollection = client.db(DB_NAME).collection("comments");
    // --------------- API END POINTS / Controllers ---------

    // Handling GET requests ------------------

    /* Get services */
    app.get("/services", async (req, res) => {
      try {
        const query = {};
        const data = await servicesCollection
          .find(query)
          .sort({ time: -1 })
          .toArray();

        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          error: false,
          data,
        });
      } catch (error) {
        console.error(error);
        res.setHeader("Content-Type", "application/json");
        res.status(501).send({ error: true, message: error.message });
      }
    });

    /* Get a single service */
    app.get("/service/:id", async (req, res) => {
      try {
        const query = { _id: ObjectId(req.params.id) };
        const data = await servicesCollection.findOne(query);

        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          error: false,
          data,
        });
      } catch (error) {
        console.error(error);
        res.setHeader("Content-Type", "application/json");
        res.status(501).send({ error: true, message: error.message });
      }
    });

    /* Get comments */
    app.get("/comments", async (req, res) => {
      try {
        const { service_id } = req.headers;
        const query = { service_id: ObjectId(service_id) };
        const data = await commentsCollection
          .find(query)
          .sort({ time: -1 })
          .toArray();

        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          error: false,
          data,
        });
      } catch (error) {
        console.error(error);
        res.setHeader("Content-Type", "application/json");
        res.status(501).send({ error: true, message: "Query Failed" });
      }
    });

    /* Get user specific comments */
    app.get("/my-comments", authGuard, async (req, res) => {
      try {
        const { uid } = res.decoded;
        const query = { uid };
        const data = await commentsCollection
          .find(query)
          .sort({ time: -1 })
          .toArray();

        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          error: false,
          data,
        });
      } catch (error) {
        console.error(error);
        res.setHeader("Content-Type", "application/json");
        res.status(501).send({ error: true, message: "Query Failed" });
      }
    });
    // Token Signing API END point
    app.get("/auth", async (req, res) => {
      try {
        const { uid } = req.headers;
        const authtoken = jwt.sign({ uid }, SECRET_JWT);
        res.setHeader("Content-Type", "application/json");
        res.status(200).send({ error: false, authtoken });
      } catch (error) {
        console.error(error);
        res.setHeader("Content-Type", "application/json");
        res.status(501).send({ error: true, message: "TOKEN SIGNING FAILED" });
      }
    });
    // END of Handling GET requests ------------------

    // Handling POST requests

    /* Post comments */
    app.post("/comments", authGuard, async (req, res) => {
      try {
        // Later uid will be recevied via JWT token
        const { service_id } = req.headers;
        const { uid } = res.decoded;

        /*
         * // Body Interface
         * body: {
         *  displayName: String,
         *  email: String,
         *	review: String,
         *  time: new Date(),
         *  rating: Number,
         *  service_title: String
         * }
         *
         */

        const body = req.body;
        const load = { ...body, uid, service_id: ObjectId(service_id) };

        const response = await commentsCollection.insertOne(load);
        response["error"] = false;

        res.setHeader("Content-Type", "application/json");
        res.status(200).send(response);
      } catch (error) {
        console.error(error);
        res.setHeader("Content-Type", "application/json");
        res.status(501).send({ error: true, message: "COMMENT POST FAILED!!" });
      }
    });

    /* Post Services */
    app.post("/services", authGuard, async (req, res) => {
      try {
        const body = req.body;
        const { uid } = res.decoded;
        const load = { ...body, uid };
        const result = await servicesCollection.insertOne(load);
        res.setHeader("Content-Type", "application/json");
        res.status(200).send({ error: false, ...result });
      } catch (error) {
        console.error(error);
        res.setHeader("Content-Type", "application/json");
        res.status(501).send({ error: true, message: "SERVICE POST FAILED!!" });
      }
    });
    // END of Handling POST requests ------------------

    // Handling DELETE requests
    app.delete("/delete-comment", authGuard, async (req, res) => {
      try {
        const { review_id } = req.headers;
        const query = { _id: ObjectId(review_id) };
        const response = await commentsCollection.deleteOne(query);
        if (response.acknowledged) {
          const rs = { ...response, error: false };
          res.setHeader("Content-Type", "application/json");
          res.status(200).send(rs);
        } else {
          res.setHeader("Content-Type", "application/json");
          res
            .status(501)
            .send({ error: true, message: "COMMENT DELETE FAILED!!" });
        }
      } catch (error) {
        console.error(error);
        res.setHeader("Content-Type", "application/json");
        res
          .status(501)
          .send({ error: true, message: "COMMENT DELETE FAILED!!" });
      }
    });
    // END of Handling DELETE requests ------------------
  } finally {
  }
}

//-----------------------------------------

run().catch((err) => console.error(err));

// Listening to PORT
app.listen(PORT, () => console.log(`SERVER is running at port: ${PORT}`));
