const express=require("express")
const router = express.Router();
const app=express()
const bodyparser = require("body-parser");


const admincontroller = require('../Controller/admincontroller');
const imagecontroller = require('../Controller/imagecontroller');
const adminVerifyToken = require("../Middleware/adminmiddleware");




app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.post("/login",admincontroller.login)

app.get("/users", admincontroller.allUsers);
app.get("/users/:id", admincontroller.specificUsers);
app.post("/products", admincontroller.createProducts);
app.put("/productsupdate/:id", admincontroller.updateProduct);
app.get("/products/:id", admincontroller.specificProducts);
app.delete("/product/:id", admincontroller.deleteProduct);

app.get("/products/:category", admincontroller.categoryData);

app.get("/products", admincontroller.allProducts);
// app.get("/products/all", adminVerifyToken, admincontroller.getallProducts);
 
 module.exports=app;
