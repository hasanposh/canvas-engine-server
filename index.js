const express = require("express");
var cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// console.log("hello");
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlu13v2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const artAndCraftCollection = client
      .db("artAndCraftDB")
      .collection("artAndCraft");

    const categoriesCollection = client
      .db("categoriesDB")
      .collection("categories");

    app.post("/artAndCraft", async (req, res) => {
      const newArtAndCraft = req.body;
      const result = await artAndCraftCollection.insertOne(newArtAndCraft);
      res.send(result);
    });

    app.get("/artAndCraft", async (req, res) => {
      const cursor = artAndCraftCollection.find();
      const results = await cursor.toArray();
      res.send(results);
    });

    app.get("/artAndCraft/craftDetails/:id", async (req, res) => {
      const id = req.params.id;
      const result = await artAndCraftCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/artAndCraft/:id", async (req, res) => {
      const id = req.params.id;
      const result = await artAndCraftCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.put("/artAndCraft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          image: updatedCraft.image,
          item_name: updatedCraft.item_name,
          // user_name : updatedCraft.user_name,
          // user_Email : updatedCraft.user_email,
          subcategory_Name: updatedCraft.subcategory_Name,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          description: updatedCraft.description,
          stock_status: updatedCraft.stock_status,
          processing_time: updatedCraft.processing_time,
          price: updatedCraft.price,
        },
      };
      const result = await artAndCraftCollection.updateOne(
        filter,
        craft,
        option
      );
      res.send(result);
    });

    app.delete("/artAndCraft/:id", async (req, res) => {
      const id = req.params.id;
      const result = await artAndCraftCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // categories collection

    app.get("/categories", async (req, res) => {
      const cursor = categoriesCollection.find();
      const results = await cursor.toArray();
      res.send(results);
    });

    app.get("/artAndCraft/categories/:subCategory", async (req, res) => {
      const subCategory = req.params.subCategory;
      const result = await artAndCraftCollection
        .find({ subcategory_Name: subCategory })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My Art And Craft Server is running ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
