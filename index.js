const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;
const { MongoClient } = require('mongodb');
const uri = "mongodb://sadique:cd-M5-gvCFc64S5@cluster0-shard-00-00.0gjnb.mongodb.net:27017,cluster0-shard-00-01.0gjnb.mongodb.net:27017,cluster0-shard-00-02.0gjnb.mongodb.net:27017/test?ssl=true&replicaSet=atlas-6k9h56-shard-0&authSource=admin&retryWrites=true&w=majority";

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await mongoClient.connect();
        const database = mongoClient.db('test');
        const productsCollection = database.collection('products');

        // POST API (post single product info)
        app.post('/add-product', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            console.log(result);
            res.send(result);
        })

        // GET API (get all products)
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        // DELETE API (delete a single product)
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                res.send(JSON.stringify(result));
            }
        })

        // UPDATE API
        app.put('/update-product/:id', async(req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = {_id: ObjectId(id)};
            const newProductInfo = {$set: updatedProduct};
            const result = await productsCollection.updateOne(filter, newProductInfo);
            res.send(JSON.stringify(result));
        })

        // GET API (get a single product)
        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.send(JSON.stringify(result));
        })

    }
    finally {
        // await mongoClient.close();
    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log('listening to 3000');
});