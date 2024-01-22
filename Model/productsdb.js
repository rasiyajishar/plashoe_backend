// const mongoose= require("mongoose")
// const productSchema = mongoose.Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     image:{
//         type:String,
//         required:false

//     },
//     description:{
//         type:String,
//         required:false
//     },
//     price:{
//         type:Number,
//         required:true
//     },
   
//     category:{
//         type:String,
//         required:true
//     }

// })
// module.exports= mongoose.model("productSchema",productSchema)
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Product", productSchema);
