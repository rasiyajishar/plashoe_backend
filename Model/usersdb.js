
// const mongoose = require("mongoose");
// const productSchema = require("./productsdb"); // Import the productSchema

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   cart: [
//     {
//       type: String,
//       required: false,
//     },
//   ],
//   wishlist: [
//     {
//       type: String,
//     },
//   ],
//   orders: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "productSchema", 
//       },
//       orderId: {
//         type: String,
//       },
//       payment: {
//         type: Number,
//       },
//       orderdetails: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
// });

// module.exports = mongoose.model("usercollection", userSchema);



const mongoose = require("mongoose");
const productSchema = require("./productsdb"); // Import the productSchema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"},
        quantity:{type:Number,default:1},
    },
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

module.exports = mongoose.model("usercollection", userSchema);