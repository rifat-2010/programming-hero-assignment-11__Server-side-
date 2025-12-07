const express = require('express')
const cors = require("cors");
require("dotenv").config()
const app = express()
const port = 3000
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');





const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qwnp7az.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const db = client.db('book-db')
    const bookCollection = db.collection('books')


    // data fetching from mongodb and http://localhost:3000/ server created
    // find
    // findOne
    app.get('/books', async(req, res) => {

      const result = await bookCollection.find().toArray();
      // console.log(result)
      res.send(result);
    })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
