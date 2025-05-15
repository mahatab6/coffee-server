const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.port || 5000 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kakgslm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    const database = client.db("coffee");
    const coffeesCollection = database.collection("coffee");

    app.get('/coffees', async (req, res) => {
      const result = await coffeesCollection.find().toArray();
      res.send(result);
    })

    app.get('/coffees/:id', async (req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeesCollection.findOne(query);
      res.send(result);

    })

    app.post('/coffees', async(req, res) => {
        const newCoffee = req.body;
        const result = await coffeesCollection.insertOne(newCoffee);
        res.send(result)
        console.log(newCoffee);
    })

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeesCollection.deleteOne(query);
      res.send(result)
    })

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateCoffe = req.body;
      const update = {
        $set: updateCoffe
      };
      const result = await coffeesCollection.updateOne(filter, update,options);
      res.send(result);
    })

    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("coffee server is runing")
})

app.listen(port, ()=>{
    console.log(`Example now server is runing ${port}`)
})
