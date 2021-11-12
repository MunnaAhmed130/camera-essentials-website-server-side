const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config();


// port
const port = process.env.PORT || 4000;

// uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgg2e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

// client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// middleware
app.use(cors());
app.use(express.json());

async function run() {
    try {
        await client.connect();
        const database = client.db('camera_essentials');
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const purchaseCollection = database.collection('purchase')

        // find all products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products)
        })

        // insert new products
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            console.log('hit the post')
            console.log(result);
            res.json(result)
        })

        //find products by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.json(result)
        })

        //delete products by id
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            console.log('deleting user')
            res.json(result)
        })

        //find purchases by email
        app.get('/purchases/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = purchaseCollection.find(query);
            const purchases = await cursor.toArray();
            res.json(purchases)
        })


        app.get('/purchases', async (req, res) => {

            console.log(req.body)

            const cursor = purchaseCollection.find({});
            const purchases = await cursor.toArray();
            res.json(purchases)
        })

        //find purchases by id
        app.get('/purchases/:id', async (req, res) => {
            const statusText = req.body
            console.log(statusText)
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await purchaseCollection.findOne(query);
            res.json(result)
        })

        //add new purchases
        app.post('/purchases', async (req, res) => {
            const purchase = req.body;
            const p = req.statusMessage;
            console.log(p)
            const result = await purchaseCollection.insertOne(purchase);
            console.log('hit the post')
            console.log(result);
            res.json(result)
        })

        //delete purchases
        app.delete('/purchases/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await purchaseCollection.deleteOne(query);
            console.log('deleting user')
            res.json(result)
        })


        //find all users
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.json(users)
        })

        //
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === "admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        // update new users
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log(result);
            res.json(result)
        })

        //
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.json(result)
        })

        //
        // app.put('/users/user', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const updateDoc = { $set: { role: 'user' } };
        //     const result = await usersCollection.updateOne(filter, updateDoc);
        //     console.log(result);
        //     res.json(result)
        // })


        //add new users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log('hit the post')
            console.log(result);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  })