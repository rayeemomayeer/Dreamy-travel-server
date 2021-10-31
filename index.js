const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elhzr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try{
    await client.connect();

    const database = client.db("DreamyTravels");
    const tourCollection = database.collection("tours");
    const orderCollection = database.collection("orders");

    //load all tours data
    app.get('/tours', async(req, res) => {
      const cursor = tourCollection.find({}); 
      const tours = await cursor.toArray();
      res.send(tours)
    })

    //load all orders data
    app.get('/orders', async(req, res) => {
      const cursor = orderCollection.find({}); 
      const orders = await cursor.toArray();
      res.send(orders)
    })
    
    // POST API
    app.post('/orders', async (req, res) => {
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result)
    });
    // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

  }
  finally{
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Dreamy Travels Server')
})
app.listen(port, () => {
  console.log(`Running Dreamy Travels Server on port `, port)
})