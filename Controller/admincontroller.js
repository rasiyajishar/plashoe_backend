const mongoose = require("mongoose");
const userSchema = require("../Model/usersdb");
const productSchema = require("../Model/productsdb");

const Joi = require("joi");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Check if email and password are valid
    // if (email !== "admin@example.com" || password !== "password") {
    //   throw new Error("Invalid Email or Password");
    // }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new Error("Invalid Email or Password");
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY);
    // const token = jwt.sign({ email }, "your-secret-key");
    res.cookie("token", token);
    res.setHeader("Authorization", token);
    res.status(200).json({ message: "Admin registered" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate the request body using Joi
//     const schema = Joi.object({
//       email: Joi.string().email().required(),
//       password: Joi.string().min(6).required(),
//     });

//     const { error } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     // Replace the following block with database lookup logic
//     // Check if email and password are valid
//     const user = await userSchema.findOne({ email });
//     if (!user) {
//       throw new Error("Invalid Email or Password");
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       throw new Error("Invalid Email or Password");
//     }

//     const token = jwt.sign({ email }, "your-secret-key");
//     res.cookie("token", token);
//     res.setHeader("Authorization", token);
//     res.status(200).json({ message: "Admin registered" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

//all users

const allUsers = async (req, res) => {
  try {
    const allUsers = await userSchema.find();
    res.json({ usersdata: allUsers });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error(err);
  }
};

//specific user
const specificUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userSchema.findById(id).populate({
      path: "orders",
      populate: {
        path: "products",
      },
    });
    if (!user) {
      res.json({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    res.json("error");
  }
};

//create a product

const createProducts = async (req, res) => {
  await productSchema.insertMany({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
  });
  const updatedProducts = await productSchema.find();
  res.json(updatedProducts);
};

// // Create a product
// const createProducts = async (req, res) => {
//   try {
//     const { title, description, price, category } = req.body;
//     const image = req.imageUrl; // Use the image URL obtained from Cloudinary

//     // Check if required fields are present
//     if (!title || !price || !category || !image) {
//       return res.status(400).json({ message: "Please provide all required product details" });
//     }

//     // Create the product
//     const product = new productSchema({
//       title,
//       description,
//       price,
//       image,
//       category,
//     });

//     await product.save();
//     res.status(201).json({ message: "Product created successfully", product });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error creating the product" });
//   }
// };

// update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    console.log(productId);
    const { title, description, price, image, category } = req.body;
    console.log(price);

    const result = await productSchema.findByIdAndUpdate(productId, {
      title,
      image,
      description,
      price,
      category,
    });
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
};

// //get all products
// const getallProducts = async (req, res) => {
//   try {
//     const allProducts = await productSchema.find();
//     res.json(allProducts);
//   } catch (error) {
//     res.json("error");
//   }
// };

const allProducts = async (req, res) => {
  try {
    const allProducts = await productSchema.find();
    res.json(allProducts);
  } catch (error) {
    res.json("error");
  }
};

//specificProducts
const specificProducts = async (req, res) => {
  try {
    const allProducts = await productSchema.findById(req.params.id);
    if (!allProducts) {
      res.json({ message: "product not found" });
    }
    res.json(allProducts);
  } catch (error) {
    res.json("error");
  }
};

//delete product

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);

    const deletedProduct = await productSchema.findByIdAndDelete(productId);
    console.log(deletedProduct);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted", deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

const categoryData = async (req, res) => {
  // products/category?name=men
  try {
    const categoryName = req.params.category;
    console.log(categoryName);
    const products = await productSchema.find({ category: categoryName });
    if (!products) {
      return res.json({ message: "product not found" });
    }
    res.json(products);
  } catch (error) {
    res.json("hello");
  }
};

// const categoryData = async (req, res) => {
//   const categoryList = req.params.category;
//   console.log(categoryList);
//   try {

//     if (categoryList == "nike") {
//       const findproduct = await productSchema.find({ category: cate });
//       return res.json(findproduct);
//     } else {
//       res.status(404).json("not found the product");
//     }
//   } catch (error) {
//     console.log(err);
//     res.status(500).json("Server Error");
//   }
// };

module.exports = {
  login,
  allUsers,
  specificUsers,
  createProducts,
  updateProduct,
  specificProducts,
  deleteProduct,
  categoryData,
  allProducts,
};
