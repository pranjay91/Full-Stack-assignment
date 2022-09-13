const express = require("express");
const app = express();
const mongoose = require("mongoose");
const registerModel = require("./schemas/register")
//const listModel = require("./models/list");
const { checkExistinguser, generatePasswordHash } = require("./utility")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
require('dotenv').config(); //for setting environment variables on server
const cors = require("cors");


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.listen(process.env.PORT || 3012, (err)=> {
    if(!err) {
        console.log("Server started at port 3012")
    } else {
        console.log(err);
    }
});

mongoose.connect("mongodb://localhost/fullStackApp", (data)=> {
   // mongoose.connect("mongodb+srv://pranjay:Pranjay9199@cluster0.mzmgp.mongodb.net/fullStackApp?retryWrites=true&w=majority",()=>{
    console.log("Successfully connected to db");
}, (err)=> {
    console.log(err)
});


app.get('/', (req, res) => {
     res.send("Full Stack App")
})
    
    
app.post("/register", async (req, res) => {
        if (await checkExistinguser(req.body.email)) {
            res.status(200).send("email already exist")
        } else {
            generatePasswordHash(req.body.password).then((passwordHash) => {
                registerModel.create({ email: req.body.email, password: passwordHash }).then((data) => {
                    res.status(200).send("user registered sucessfully")
                }).catch((err) => {
                    res.status(400).send(err.message)
                })
    
            })
    
        }
    })
    
    
app.post("/login", (req, res) => {
        registerModel.find({ email: req.body.email }).then((userData) => {
    
            if (userData.length) {
                bcrypt.compare(req.body.password, userData[0].password).then((val) => {
                    if (val) {
                        const authToken = jwt.sign(userData[0].email, process.env.SECRET_KEY);
                        // console.log(1)
                        res.status(200).send({ authToken });
                    } else {
                        res.status(400).send("invalid password please enter correct password")
                    }
                })
            } else  {
                res.status(400).send("email not exist please signup")
            }
        })
    })
    
    
 app.post("/logout", (req, res) => {
        authToken = ""
        res.status(200).send("Loggedout sucessfully")
    })