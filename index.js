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


        //GET API for single service
        app.get('/singleService/:id', async (req, res) => {

            const serviceId = req.params.id;
            console.log(serviceId);
            const query = { _id: ObjectId(serviceId) };


            const service = await servicesCollection.findOne(query);

            console.log(service);

            res.json(service);

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

        //DELETE API for services        
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

        //POST API for updating services        
        app.post('/addService', async (req, res) => {
            const service = req.body;
            console.log(service);

            // create a document to insert
            const doc = {
                name: `${service.name}`,
                img: `${service.img}`,
                shortDescription: `${service.shortDescription}`,
                detailDescription: `${service.detailDescription}`,
                price: `${service.price}`,
            }
            const result = await servicesCollection.insertOne(doc);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })


        //PUT API for updating services        
        app.put('/updateService/:id', async (req, res) => {

            const serviceId = req.params.id;
            const service = req.body;
            console.log(serviceId);
            // create a filter for a service to update
            const filter = { _id: ObjectId(serviceId) };

            const options = { upsert: true };
            // create a document that sets the properties of the services
            const updateDoc = {
                $set: {
                    name: `${service.name}`,
                    img: `${service.img}`,
                    shortDescription: `${service.shortDescription}`,
                    detailDescription: `${service.detailDescription}`,
                    price: `${service.price}`
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options);
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );

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