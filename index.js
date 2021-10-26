const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express()
const port = 5000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oa9tu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





async function run() {
    try {
        await client.connect();
        const database = client.db("pet_care_database");
        const servicesCollection = database.collection("services");
        const storeCollection = database.collection("store_data");


        //GET API for services
        app.get('/services', async (req, res) => {
            const query = {};

            const cursor = servicesCollection.find(query);
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                console.log("No documents found!");
            }
            // replace console.dir with your callback to access individual elements
            const services = await cursor.toArray();
            res.json(services);
        })


        //GET API for store data
        app.get('/storeData', async (req, res) => {
            const query = {};

            const cursor = storeCollection.find(query);
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                console.log("No documents found!");
            }
            // replace console.dir with your callback to access individual elements
            const storeData = await cursor.toArray();
            res.json(storeData);
        })

        app.delete('/deleteService/:id', async (req, res) => {

            const serviceId = req.params.id;
            console.log(serviceId);
            const query = { _id: ObjectId(serviceId) };
            const result = await servicesCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }
            res.json(result);
        })


    } finally {
        //await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})