// import express from "express";
// import path from "path";
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
})
.then(() => console.log("Database Conneted"))
.catch((e) => console.log(e));


// adich contact 
// const messageSchema = new mongoose.Schema({
//     name: String,
//     email: String,
// });

// const Message = mongoose.model("Message", messageSchema)
 

// after login

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema)

//ejs 
const users = [];


const app = express();

// using middleware
//middleware = use is mmiddleware for using
app.use(express.static(path.join(__dirname, "public")));

console.log(__dirname);
//using middleware
app.use(express.urlencoded({extended: true}))

// console.log(path.join(__dirname, "public"))
app.use(cookieParser())


// cookie
//seting up a view engine dynamic data name cha veriable

app.set("view engine", "ejs");  // for view our website on backend

const isAuthenticated = async (req,res,next) =>{ // middleware
    const {token} = req.cookies;

    if(token){

        const decoded = jwt.verify(token, "edgjnjerngjren") // same key nahiter work nhi karnar

        console.log(decoded); // convert ti original id
        req.user = await User.findById(decoded._id)


        next();
    }
    else{ // login asele ki home ver nahi ganar
        res.redirect("/login")
    }
} 


// middleware used here first is authenticate or not check karin
app.get("/", isAuthenticated, (req, res) =>{
    console.log(req.cookies);

   console.log(req.user);

    res.render("logout", {name: req.user.name}) // index madhe jail token asel ki logout disel
    
});


app.get("/login", (req, res) =>{
    

    res.render("login") // index madhe jail token asel ki logout disel
    
});


// middleware used here
app.get("/register", (req, res) =>{
    console.log(req.cookies);

    console.log(req.user);

    res.render("register") // index madhe jail token asel ki logout disel
    
});

//post request

app.post("/login", async(req,res) =>{
    const {email, password } = req.body;

    let user = await User.findOne({email});
    if(!user){
        
        return res.redirect("/register");
    }

    const ismatch = user.password === password;
    // bcrypt use kel ki
    // const isMatch = await bcrypt.compare(password, user.password)

    if(!ismatch) return res.render("login", {message:"Incorrect Password"});

    
    const token = jwt.sign({_id:user._id}, "edgjnjerngjren")
    console.log(token);

    res.cookie("token", token,{ // user._id hi token madhe save keli
        httpOnly:true,
        expires: new Date(Date.now() + 60 * 1000)
    }) // click kel ki application madhe token hi cookie yete
    res.redirect("/");
    
   
    // res.render("login"); before he hot
})

app.post("/register", async(req,res) =>{

    console.log(req.body);

    const {name, email, password} = req.body;

    let user = await User.findOne({email});
    if(user){
        
        return res.redirect("/login");
    }

    // bcrypt sathi he and create cha time la password: hashedpassword he gaych 

    // const hashedpassword = await bcrypt.hash(password,10);


    user = await User.create({name , email, password})

    const token = jwt.sign({_id:user._id}, "edgjnjerngjren")
    console.log(token);

    res.cookie("token", token,{ // user._id hi token madhe save keli
        httpOnly:true,
        expires: new Date(Date.now() + 60 * 1000)
    }) // click kel ki application madhe token hi cookie yete
    res.redirect("/");
})


// app.post("/login", async(req,res) =>{

//     console.log(req.body);

//     const {name, email} = req.body;

//     let user = await User.findOne({email});
//     if(!user){
//         console.log("Register first");
//         return res.redirect("/register");
//     }


//     user = await User.create({name , email})

//     const token = jwt.sign({_id:user._id}, "edgjnjerngjren")
//     console.log(token);

//     res.cookie("token", token,{ // user._id hi token madhe save keli
//         httpOnly:true,
//         expires: new Date(Date.now() + 60 * 1000)
//     }) // click kel ki application madhe token hi cookie yete
//     res.redirect("/");
// })



app.get("/logout", (req,res) =>{
    res.cookie("token", null,{
        httpOnly:true,
        expires: new Date(Date.now())
    }) // click kel ki application madhe token hi cookie yete
    res.redirect("/");
})

// first he kel hot after above


// public directory serv keli
// app.get('/', (req, res) =>{
//     res.render("index", {name: "kanchan"}) // index madhe jail
    
// });


app.post('/contact', async(req,res) =>{
    // console.log(req.body) // from cha data la assenss karu sakata
    // users.push({username:req.body.name, email: req.body.email}) // users ha array ahe store kelela

    // add to database

    // const {name, email} = req.body;
    // await Message.create({name, email});
    // or to write
    

    
    const messageData = {name: req.body.name, email: req.body.email};

    console.log(messageData);
   
   await Message.create(messageData)

    res.render("success") // from submit kela ki ya page ver redirect hoil
})


app.get("/users", (req, res)=>{ // arrr shoew karaych 
    res.json({
        users,

    });
})


// app.get("/add", async (req, res) =>{

//     await Message.create({name:"komal",email:"sample@gmail.com"}) // dummy
//         res.send("Nice")
    
// })

// static website served
app.listen(8000, () =>{
    console.log("server started");
})

//mongodb mongo cha video for completly understand

