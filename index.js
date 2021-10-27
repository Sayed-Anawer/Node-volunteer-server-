const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vlj80.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  await client.connect();
  const database = client.db("volunteerDatabase");
  const volunteerService = database.collection("volunteerServices");

  try {
    app.get("/", async (req, res) => {
      res.send("This is home");
    });

    // This data is collecting from database and set it server /data url
    app.get("/data", async (req, res) => {
      const cursor = volunteerService.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    app.post("/data", async (req, res) => {
      const service = req.body;

      const result = volunteerService.insertOne(service);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir());

console.log(uri);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
