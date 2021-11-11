const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// Middle Ware
app.use(cors());
app.use(express.json());

// Connect Databae with Server
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y4rvt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
        const database = client.db("store");
        const carCollection = database.collection("items");
        // Get Api
        app.get("/store", async(req,res)=>{
            const cursor = carCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
    }
    finally{
        // await client.close();
    }
};
run().catch(console.dir);



// Root route
app.get("/", (req,res)=>{
    res.send("Kire vatija vala acos ?")
});

// Connect Port
app.listen(port, (req,res)=>{
    console.log(`Port listing at ${port}`);
})