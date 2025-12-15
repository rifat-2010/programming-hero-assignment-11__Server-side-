const express = require('express')
const cors = require("cors");
require("dotenv").config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express()
const port = 3000
// need to change origin url to deploy url after finishing deploy this site
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
  //for firebase admin
  const admin = require("firebase-admin");
  const serviceAccount = require("./serviceKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });





const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qwnp7az.mongodb.net/?appName=Cluster0`;



// // jwt middlewares
// const verifyJWT = async (req, res, next) => {
//   const token = req?.headers?.authorization?.split(' ')[1]
//   console.log(token)
//   if (!token) return res.status(401).send({ message: 'Unauthorized Access!' })
//   try {

//     const decoded = await admin.auth().verifyIdToken(token)
//     req.tokenEmail = decoded.email
//     console.log(decoded)
//     next()
//   } catch (err) {
//     console.log(err)
//     return res.status(401).send({ message: 'Unauthorized Access!', err })
//   }
// }


// from conceptual session
// const verifyToken = async (req, res, next) => {
//   const authorization = req.headers.authorization
//   const token = authorization.split(' ')[1]
//   if (!token) {
//     res.status(401).send({
//       message: "unauthorized access."
//     })
//   }
//   try {
//     await admin.auth().verifyIdToken(token)
//   } catch (err) {
//     console.log(err)
//     return res.status(401).send({ message: 'Unauthorized Access!', err })
//   }
// }



// Create a MongoClient with a MongoClientOptions object to set the Stable API version.
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
    const orderCollection = db.collection('order')
    const wishlistCollection = db.collection('wishlist')


    // data fetching from mongodb and http://localhost:3000/ server created
    // find
    // findOne
    app.get('/books', async (req, res) => {
      console.log("headers -------< jwt --->", req.headers)
    const result = await bookCollection.find({ status: "published" }).toArray();
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



       // for search bar in Public_Habits page
    app.get("/search", async (req, res) => {
        const search = req.query.search || "";
        // console.log(search)
        const filter = {
          status: "published",
          title: { $regex: search, $options: "i" }
        };
        const result = await bookCollection.find(filter).toArray();
        // console.log(result);
        res.send(result);
    });




//     // GET /search → search & sort by price
// // GET /books/sort?sort=high || sort=low
// // GET /books?sort=asc|desc
// app.get("/books", async (req, res) => {
//   try {
//     const sort = req.query.sort; // "asc" or "desc"
//     let sortOption = {};

//     if (sort === "asc") {
//       sortOption = { price: 1 }; // Low to High
//     } else if (sort === "desc") {
//       sortOption = { price: -1 }; // High to Low
//     }

//     const result = await bookCollection
//       .find({ status: "published" })
//       .sort(sortOption)
//       .toArray();

//     res.send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Server error" });
//   }
// });








    // latest 8 data 
    // get
    // find
app.get('/latest-books', async (req, res) => {
  const result = await bookCollection
    .find()
    .sort({ _id: -1 })
    .limit(8)
    .toArray();

  res.send(result);
});


// handle All Users_page for admin role in dashboard
  app.get('/all-users', async (req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
   });



// handle All Manage_Books-page for admin role in dashboard
  app.get('/all-books', async (req, res) => {
     console.log("headers -------< jwt --->", req.headers.authorization)
    const result = await bookCollection.find().toArray();
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


    // post method //for new book_cart
    //  insertOne
   //  insertMany 
   app.post('/books', async (req, res) => {
     const data = req.body
        // console.log(data)
        const result = await bookCollection.insertOne(data)
        res.send({
            success: true,
            result
        })
   })



    // POST /for my-books → for new order data adding
    app.post('/orders', async (req, res) => {
      try {
        const data = req.body;
        console.log(data)
         const orderData = {
          userId: data.userId,  
          bookId: data.bookId,    
          Price: data.price,
          BookName: data.BookName,
          BookImg: data.BookImg, 
          name: data.name,       
          email: data.email,     
          phone: data.phone,
          address: data.address,
          orderDate: new Date(),
          addedBy: data.email,
          status: 'pending',
          paymentStatus: 'unpaid'
        };

        const result = await orderCollection.insertOne(orderData);

        res.send({
          success: true,
          result
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create order" });
      }
    });




    // POST /wishlist → add book to user's wishlist
app.post('/wishlist', async (req, res) => {
  try {
    const data = req.body;  // client থেকে আসা data
    console.log("Wishlist Data:", data);

    if (!data.userId || !data.bookId) {
      return res.status(400).send({ success: false, message: "userId and bookId required" });
    }

    // check if book already in wishlist // for my-wishlist in user's dashboard
    const exists = await wishlistCollection.findOne({ userId: data.userId, bookId: data.bookId });
    if (exists) {
      return res.status(400).send({ success: false, message: "Book already in wishlist" });
    }

    const wishlistData = {
      userId: data.userId,
      bookId: data.bookId,
      BookName: data.BookName,
      BookImg: data.BookImg,
      added_by: data.email,
      price: data.price,
      addedAt: new Date(),
    };

    const result = await wishlistCollection.insertOne(wishlistData);

    res.send({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Failed to add to wishlist" });
  }
});



  // POST /books/:id/review → add review to a book
app.post('/books/:id/review', async (req, res) => {
  try {
    const bookId = req.params.id;
    const review = req.body;

    const result = await bookCollection.updateOne(
      { _id: new ObjectId(bookId) },
      {
        $push: {
          reviews: {
            name: review.name,
            userId: review.userId,
            userEmail: review.userEmail,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date()
          }
        }
      }
    );

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
});







// GET /orders?email=user@email.com
app.get('/orders', async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({ success: false, message: "Email is required" });
    }

    const orders = await orderCollection.find({ email }).toArray();

    res.send({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to fetch orders" });
  }
});



// GET /wishlist?email=userEmail → fetch wishlist of a user
app.get('/wishlist', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).send({ success: false, message: "Email required" });

    const wishlistItems = await wishlistCollection
      .find({ added_by: email })
      .sort({ addedAt: -1 }) // recent added first
      .toArray();

    res.send({
      success: true,
      wishlist: wishlistItems
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Failed to fetch wishlist" });
  }
});




// PATCH /orders/cancel/:id
app.patch('/orders/cancel/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const result = await orderCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'cancelled'
        }
      }
    );

    res.send({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false });
  }
});



// PUT /orders/:id → update order status
app.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).send({ message: "Status required" });

  const result = await orderCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );

  if (result.matchedCount === 0) {
    return res.status(404).send({ message: "Order not found" });
  }

  res.send({ success: true });
});



// update book status (admin manage books page)
app.put('/books/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({ success: false, message: 'Status required' });
    }

    const objectId = new ObjectId(id);

    const result = await bookCollection.updateOne(
      { _id: objectId },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ success: false, message: 'Book not found' });
    }

    // Status updated successfully in database
    res.send({ success: true, message: 'Book status updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
});



// All Server Code Already Here -- because I faced A issue of push this server code .
// then I went to support and Instractor gave me a sullution
// But the main problem is that My all previous coment has deleted in github


// PUT /users/role/:id → update user role (admin only)
app.put('/users/role/:id', async (req, res) => {
  const { id } = req.params
  const { role } = req.body

  if (!role) {
    return res.status(400).send({ success: false, message: "Role required" })
  }

  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role } }
  )

  if (result.matchedCount === 0) {
    return res.status(404).send({ success: false, message: "User not found" })
  }

  res.send({ success: true })
})





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



  // for my-books page in bashboard for librarian
app.get("/my-books", async (req, res) => {
  const email = req.query.email;
  const result = await bookCollection.find({ email: email }).toArray();
  // const result = await orderCollection.find({ email }).toArray();
  res.send(result);
});




   //PUT //For Update_Habit __ page
   //updateOne
   //updateMany
   app.put('/users/:id',  async (req, res) => {
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


   //PUT //For Update_Order_Book __ page
   //updateOne
   //updateMany
  app.put('/order-book/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const objectId = new ObjectId(id);
        const filter = { _id: objectId };

        // Update bookCollection document
        const result = await bookCollection.updateOne(filter, { $set: data });

        if (result.modifiedCount === 1) {
            return res.send({ success: true, message: "Book updated successfully!" });
        } else {
            return res.send({ success: false, message: "No changes made or book not found." });
        }
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});



// GET single book by id (for update page)
app.get('/order-book/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new ObjectId(id);

        const book = await bookCollection.findOne({ _id: objectId });

        if (!book) return res.status(404).send({ success: false, message: "Book not found" });

        res.send(book);
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});





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




    // delete //for book delet by clicking the delet button admin dashboard's mangae Books_page
   // deleteOne
   // deleteMany
      app.delete('/books/:id', async (req, res) => {
        const { id } = req.params

        const result = await bookCollection.deleteOne({
          _id: new ObjectId(id)
        })

        if (result.deletedCount === 0) {
          return res.status(404).send({ success: false })
        }

        res.send({ success: true, result })
      })




        // Payment endpoints
    app.post('/create-checkout-session', async (req, res) => {
      const paymentInfo = req.body
      console.log(paymentInfo)
      const session = await stripe.checkout.sessions.create({
        line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Book Order',
              description: `Order for book ID: ${paymentInfo.bookInfo.bookId}`,
            },
            unit_amount: paymentInfo?.bookInfo?.price * 100,
          },
          quantity: paymentInfo?.quantity || 1,
        },
      ],

      customer_email: paymentInfo?.customer?.email,

      mode: 'payment',

      metadata: {
        orderId: String(paymentInfo.orderId),
        bookId: String(paymentInfo.bookInfo.bookId),
        customerName: String(paymentInfo.customer.name),
        customerEmail: String(paymentInfo.customer.email),
      },
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/book-details_page/${paymentInfo?.bookId}`,
      })
      res.send({ url: session.url })
    })




    app.post('/payment-success', async (req, res) => {
    try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).send({ success: false, message: "Session ID missing" });
    }

    // Stripe session retrieve
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Payment complete checking
    if (session.payment_status !== "paid") {
      return res.status(400).send({
        success: false,
        message: "Payment not completed",
      });
    }

    // metadata > orderId rechive
    const orderId = session.metadata.orderId;

    // Order update
    const updateResult = await orderCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status: "confirmed",
          paymentStatus: "paid",
          transactionId: session.payment_intent,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Order not found or already updated",
      });
    }

    res.send({
      success: true,
      message: "Payment successful & order updated",
      orderId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Payment success processing failed",
    });
  }
});



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
  res.send('Hello World! from Rifatuzzaman')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
