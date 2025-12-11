const express = require('express')
const cors = require("cors");
require("dotenv").config()
const app = express()
const port = 3000
// need to change origin url to deploy url after finishing deploy this site
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');





const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qwnp7az.mongodb.net/?appName=Cluster0`;



// jwt middlewares
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1]
  console.log('string---> token', token)
  if (!token) return res.status(401).send({ message: 'Unauthorized Access!' })
  try {

    const decoded = await admin.auth().verifyIdToken(token)
    req.tokenEmail = decoded.email
    console.log('decoded---->', decoded)
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).send({ message: 'Unauthorized Access!', err })
  }
}




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
    const usersCollection = db.collection('users')


    // data fetching from mongodb and http://localhost:3000/ server created
    // find
    // findOne
    app.get('/books', async (req, res) => {
    const result = await bookCollection.find({ status: "published" }).toArray();
    res.send(result);
   });


       // for search bar in Public_Habits page
    app.get("/search", async (req, res) => {
        const search = req.query.search || "";
        // console.log(search)

        const filter = {
          title: { $regex: search, $options: "i" }
        };

        const result = await bookCollection.find(filter).toArray();
        // console.log(result);
        res.send(result);
    });




    // fetching one data from mongodb and for Details page of every single card data.
    // findOne
    app.get('/books/:id', async(req, res) => {

      const {id} =  req.params;
      // console.log(id)
      const result = await bookCollection.findOne({_id: new ObjectId(id)});
      res.send({
      success: true,
      result
      })
    })




    // latest 6 data 
    // get
    // find
app.get('/latest-books', async (req, res) => {
  const result = await bookCollection
    .find()
    .sort({ _id: -1 })
    .limit(6)
    .toArray();

  res.send(result);
});




// get a user's role
app.get('/user/role/:email',  async(req, res) => {
  const email = req.params.email;
  const result = await usersCollection.findOne({email});
  res.send({role: result?.role})

})


  // GET user by MongoDB _id
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const objectId = new ObjectId(id);
    const user = await usersCollection.findOne({ _id: objectId });
    if (!user) return res.status(404).send({ success: false, message: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});



// GET user by email
app.get('/users', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).send({ success: false, message: "Email is required" });

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    res.send({ success: true, user });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});




   //PUT //For Update_Habit __ page
   //updateOne
   //updateMany

   app.put('/users/:id', verifyJWT, async (req, res) => {
        const {id} = req.params
        const data = req.body
        // console.log(id)
        // console.log(data)
        const objectId = new ObjectId(id)
        const filter = {_id: objectId}
        const update = {
            $set: data
        }

       const result  = await usersCollection.updateOne(filter, update)


       res.send({
        success: true,
        result
       })
   })




      // save or update a user in db
    app.post('/user', async (req, res) => {
      const userData = req.body
      userData.created_at = new Date().toISOString()
      userData.last_loggedIn = new Date().toISOString()
      userData.role = 'user'

      const query = {
        email: userData.email,
      }

      const alreadyExists = await usersCollection.findOne(query)
      console.log('User Already Exconsoleists---> ', !!alreadyExists)

      if (alreadyExists) {
        console.log('Updating user info......')
        const result = await usersCollection.updateOne(query, {
          $set: {
            last_loggedIn: new Date().toISOString(),
          },
        })
        return res.send(result)
      }

      console.log('Saving new user info......')
      const result = await usersCollection.insertOne(userData)
      res.send(result)
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
