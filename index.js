const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require('mongodb');
const objectId = require("mongodb").ObjectId;
const { json } = require("express");
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
        const serviceCollection = database.collection("services");
        const ordersCollection = database.collection("orders");
        const usersCollection = database.collection("users");
        const reviewCollection = database.collection("reviews");
        // Get Api
        app.get("/store", async(req,res)=>{
            const cursor = carCollection.find({});
            const splitData = cursor.limit(6);
            const result = await splitData.toArray();
            res.send(result);
        });
        // Get More details api
        app.get("/store/more", async(req,res)=>{
            const cursor = carCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        // Get Services Api
        app.get("/services", async(req,res)=>{
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        // Get specific Car Api
        app.get("/store/:id", async(req,res)=>{
            const id = req.params.id;
            const query = { _id : objectId(id) };
            const result = await carCollection.findOne(query);
            res.send(result);
        });
        // Get all orders Api
        app.get("/orders", async(req,res)=>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        });
        // Get specific orders api
        app.get("/orders/order", async(req,res)=>{
            const email = req.query.email;
            const query = {email : email};
            const cursor  = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })
        // get Api for user info
        app.get("/users/:email" , async(req,res)=>{
            const email = req.params.email;
            console.log(email);
            const query = { email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === "admin"){
                isAdmin = true;
            }
            res.json({admin: isAdmin});
        });
        // // Get review api 
        app.get("/reviews", async(req,res)=>{
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        // Post Api for add car
        app.post("/store/more", async(req,res)=>{
            const car = req.body;
            const result = await carCollection.insertOne(car);
            res.json(result);
        });
        // Post Orders Api 
        app.post("/orders", async(req,res)=>{
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            res.json(result);
        });
        // Post users api
        app.post("/users", async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        // Post Review 
        app.post("/reviews", async(req,res)=>{
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })
        // Post update data
        app.put("/users", async(req,res)=>{
            const user = req.body;
            const filter = { email : user.email };
            const options = { upsert: true };
            const updateDoc = {$set : user};
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        app.put("/users/admin", async(req,res)=>{
            const user = req.body;
            const filter = { email : user.email };
            const updateDoc = {$set : {role : "admin"}};
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        });
        // Delete order
        app.delete("/orders", async(req,res)=>{
            const email = req.query.email;
            const query = {email};
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });
        // Delet Product 
        app.delete("/store/more/:id", async(req,res)=>{
            const id = req.params.id;
            const query = { _id  : objectId(id)};
            const result = await carCollection.deleteOne(query);
            res.json(result);
            console.log(result);
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