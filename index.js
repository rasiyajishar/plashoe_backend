
const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors")

const cookieParser=require("cookie-parser")
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce-mern")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error.message);
  });



// admin routes
const adminrouter = require('./Routers/adminrouter')
app.use('/admin',adminrouter)

// user route
const userrouter = require('./Routers/userrouter')
app.use('/user',userrouter)


app.listen(port, () => {
  console.log("Server is running on port", port);
});
