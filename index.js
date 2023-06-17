const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
app.use(cors());
//it converts the string to json which we get from the body by post method 
app.use(express.json());
// const foods = require('./data/FoodCategory.json')
// const owners = require('./data/OwnerCategory.json')


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://RestaurantManagementSystem:1Iqq4OEF98RTQMsK@cluster0.nsbpt4t.mongodb.net/?retryWrites=true&w=majority";

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const allFoodCollection = await client.db("RestaurantManagementSystem").collection("FoodCategory");
    const allOwnerCollection = await client.db("RestaurantManagementSystem").collection("OwnerCategory");

    //api for fetching all food
    app.get('/all-food', async(req, res) => {
      const cursor = allFoodCollection.find();
      const allFood = await cursor.toArray();
      res.send({
        food_category:allFood
      })
    });

    // api for fetching all owner
    app.get('/all-owner', async(req, res) => {
      const cursor = allOwnerCollection.find();
      const allOwner = await cursor.toArray();
      res.send({
        owner_category:allOwner
      })
    });

    // api for fetching details of an owner
    app.get('/owner-details/:id', async(req, res) => {
      const id = req.params.id;//catching the id
      const query = {_id : new ObjectId(id)};//using new instance we are rapping the id,As mongodb save the id as ObejectId(id)
      const owner_detail = await allOwnerCollection.findOne(query);//findOne method always gets an object.as we are searching for the details of an owner which is an object ,so we don't need to convert it into an array
      res.send(owner_detail);
    })

    // api for fetching details of a food
    app.get('/food-details/:id', async(req, res) => {
      const id = req.params.id;//catching the id
      const query = {_id : new ObjectId(id)};//using new instance we are rapping the id,As mongodb save the id as ObejectId(id)
      const food_detail = await allFoodCollection.findOne(query);//findOne method always gets an object.as we are searching for the details of an owner which is an object ,so we don't need to convert it into an array
      res.send(food_detail);
    })

    //api for adding new food
    app.post('/post-food', async(req, res) => {
      const newFoodInfo = req.body;
      const result = await allFoodCollection.insertOne(newFoodInfo);
      // console.log(newFoodInfo);
      res.send(result)
    })

    //api for deleting a food
    app.delete('/delete-food/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await allFoodCollection.deleteOne(query);
      // console.log(newFoodInfo);
      res.send(result)
    })

    //api for adding new owner
    app.post('/post-owner', async(req, res) => {
      const newOwnerInfo = req.body;
      const result = await allOwnerCollection.insertOne(newOwnerInfo);
      // console.log(newOwnerInfo);
      res.send(result)
    })

    // api for deleting a owner
    app.delete('/delete-owner/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await allOwnerCollection.deleteOne(query);
      // console.log(newFoodInfo);
      res.send(result)
    })

    // Update a food
    // app.put("/update-food/:id", async(req, res) => {
    //   const id = req.params.id;
    //   const query = {_id : new ObjectId(id)};
    //   const { updatedfood } = req.body;

    //   const filter = { _id: new ObjectId(query) };
    //   const options = { upsert: true };

    //   const updates = {
    //     $set: updatedfood,
    //   };

    //   // Update method
    //   const result = await allFoodCollection.updateOne(filter, updates, options);
    //   res.send(result);
    // });

    // Update a owner
    // app.put("/update-owner/:id", async (req, res) => {
    //   const { id } = req.params;
    //   const { updatedOwner } = req.body;

    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };

    //   const updates = {
    //     $set: updatedOwner,
    //   };

    //   // Update method
    //   const result = await allOwnerCollection.updateOne(filter, updates, options);
    //   res.send(result);
    // });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', async(req, res) => {
  res.send({message:"hi"});
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})