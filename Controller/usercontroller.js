
const productSchema=require("../Model/productsdb")
const mongoose = require("mongoose");
const userSchema=require("../Model/usersdb")
const Joi = require('joi'); 
const bcrypt = require('bcrypt');
const stripe = require("stripe")(process.env.STRIPE_KEY)
const jwt=require("jsonwebtoken")
const orderdb = require("../Model/orderdb");
let sValue = {};

// Validation schema for user registration
const registerValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Validation schema for user login
const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
//order validation schema
const orderValidationSchema = Joi.object({
  price: Joi.number().required(),
});



//register
// const register = async(req,res)=>{
//     console.log(req.body);
//     await userSchema.insertMany({
//         username:req.body.username,
//         email:req.body.email,
//         password:req.body.password
//     })
//     res.json("user registered")
// }




const register = async (req, res) => {
  try {
    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
//password hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    
    await userSchema.insertMany({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    res.json("User registered successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};


//login

// const userLogin = async (req, res) => {
//     try {
//       const login = await userSchema.findOne({ email: req.body.email });
  
//       if (login && login.email === req.body.email && login.password === req.body.password) {
//         const token = jwt.sign({ email: login.email }, "secret-key");
//         res.cookie("token", token);
//         res.json({ message: "User logged in successfully" });
//         return;
//       }
  
//       res.status(401).json({ error: "Wrong password or email" });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Server error" });
//     }
//   };

 
  

const userLogin = async (req, res) => {
  try {
    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const login = await userSchema.findOne({ email: req.body.email });

    if (login && login.email === req.body.email) {
      const passwordMatch = await bcrypt.compare(req.body.password, login.password);
      if (passwordMatch) {
        const token = jwt.sign({ email: login.email }, "secret-key");
        res.cookie("token", token);
        res.json({ message: "User logged in successfully", userID: login._id,jwt_token:token });
        return;
      }
    }

    res.status(401).json({ error: "Wrong password or email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};



const allProducts = async (req, res) => {
  try {
    const allProducts = await productSchema.find();
    res.json({data: allProducts});
  } catch (err) {
    res.json("error");
  }
};



// specific products

const specificproduct=async(req,res)=>{
try{
const productid=await productSchema.findById(req.params.id)
if(!productid){
  res.json({message:"product not found"})
}
res.json(productid)
}catch(error){
res.json({message:"server error"})
}
}





// const categorydata = async (req, res) => {
//   const categoryList = req.params.category;
//   // console.log(categoryList);
//   try {
  
//     if (categoryList == "nike") {
//       const findproduct = await productSchema.find({ category: { $in: "nike" } });
//       return res.json(findproduct);
//     }else {
//       res.status(404).json("not found the category");
//     }
//   } catch (error) {
//     console.log(err);
//     res.status(500).json("Server Error");
//   }
// };


const categorydatas = async(req,res)=>{
  const categorytype=req.params.category;
  try{
    if(categorytype=="men"){
      const findproduct = await productSchema.find({category:{$in:"men"}});
      return res.json(findproduct)
    }else{
      res.status(404).json("not found the category")
    }
  }catch(error){
  res.status(500).json("server error")
}

}

const addTocart = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await userSchema.findById(userID)
    if (!user) {
      return res.json({ message: "user not found" });
    }

    const { productId } = req.body
    const product = await productSchema.findById(productId);

    if (!product) {
      return res.json({ message: "product not found" });
    }

    await userSchema.findByIdAndUpdate(userID, { $addToSet: { cart: { product: productId } } });

    res.json({ message: "Product added to the cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







const getCart = async (req, res) => {
  try {
    
const userID=req.params.id
    const user = await userSchema.findById(userID).populate('cart.product')

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItems = user.cart;

    res.status(200).json({ message: "Your cart products", cart: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", error: error.message });
  }
};





const removeCart = async (req, res) => {
  try {
    const userID = req.params.id;
    const productId = req.params.product

    // const token = req.cookies.token;
    // const verified = jwt.verify(token, "secret-key");

    const user = await userSchema.findById(userID);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }

    await userSchema.findByIdAndUpdate(userID, { $pull: { cart: { product: productId } } });

    res.status(200).json({ message: "Product removed from your cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// updateCartItemQuantity: async (req, res) => {
  const updateCartItemQuantity = async (req, res) => {
    // Extracting userID, id (cart item id), and quantityChange from request body
    const userID = req.params.id;
    console.log(userID)
    const { id, quantityChange } = req.body;
    console.log(id, quantityChange)
  
    // Find the user by ID
    const user = await userSchema.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Update the quantity of the specified cart item
    const updatedCart = (user.cart.id(id).quantity += quantityChange);
  
    // If the updated quantity is greater than 0, save the user document
    if (updatedCart > 0) {
      await user.save();
    }
  
    // Respond with a success message and the updated cart data
    res.status(200).json({
      status: 'success',
      message: 'Cart item quantity updated',
      data: user.cart
    });
  };
  








  const addToWishlist = async (req, res) => {
    try {
      const userID = req.params.id;
      const user = await userSchema.findById(userID)
      if (!user) {
        return res.json({ message: "user not found" });
      }
  
      const { productId } = req.body
      console.log(productId)
      const product = await productSchema.findById(productId);
  
      if (!product) {
        return res.json({ message: "product not found" });
      }
  
      await userSchema.findByIdAndUpdate(userID, { $addToSet: { wishlist: productId } });
  
      res.json({ message: "Product added to the wishlist" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  
  



  
  //getwishlist

  const getWishlist = async (req, res) => {
    try {
      
  const userID=req.params.id
      const user = await userSchema.findById(userID).populate('wishlist')
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const wishlistItems = user.wishlist;
  
      res.status(200).json({ message: "Your  products", wishlist: wishlistItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error", error: error.message });
    }
  };
  


  const removeWishlist= async (req, res) => {
    try {
    const userID = req.params.id
    const productID = req.params.product

    const user = await userSchema.findById(userID);
    if (!user) { return res.status(404).json({ message: 'User not found' }) }

    await userSchema.findByIdAndUpdate(userID, { $pull: { wishlist: productID } });
    res.status(200).json({ message: "Product removed from your wishlist" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
  }



  //remove wishlist
  // const removeWishlist = async (req, res) => {
  //   try {
  //     const productId = req.params.id;
  //     const token = req.cookies.token;
  //     const verified = jwt.verify(token, "secret-key");
  
  //     const user = await userSchema.findOne({ email: verified.email });
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  
  //     const index = user.wishlist.indexOf(productId);
  //     if (index == 1) {
  //       return res.status(404).json({ message: "Product not found in wishlist" });
  //     }
  
  //     user.wishlist.splice(index, 1);
  //     await user.save();
  
  //     res.status(200).json({ message: "Product removed from your wishlist" });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ error: "Server error", message: error.message });
  //   }
  // };



  //order &payment
  const payment = async (req, res) => {
      try {
      const userID = req.params.id;
      const user = await userSchema.findById(userID).populate('cart.product');
      if (!user) { return res.status(404).json({ message: 'User not found' }) }
      if (user.cart.length === 0) { return res.status(404).json({ message: 'Cart is empty' }) }

      const line_items = user.cart.map(item => {
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    images: [item.product.image],
                    name: item.product.title,
                },
                unit_amount: Math.round(item.product.price * 100),
            },
            quantity: item.quantity,
        };
    })

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/Paymentsuccess',
      cancel_url: 'http://localhost:4000/user/payment/cancel',
  });

  sValue = {userID,user, session};




  res.status(200).json({
    status: 'success',
    message: 'Stripe Checkout session created',
    sessionId: session.id,
    url: session.url
})
    }
    catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error" });
    }
    };
      //  const sUser = user;
      //  const sess = session


//  sValue={}


const paymentSuccess = async (req, res) => {
  // Destructure properties from sValue
  const  {userID,user, session} = sValue 

  // Extract cart items from the user object
  const cartItems = user.cart;
  let odb = true

  // Create a new order in the database using the orderdb model
  const checkExistingOrder = await orderdb.findOne({ order_id: session.id });

if(!checkExistingOrder){
  const order = await orderdb.create({
    // Set the userid in the order document
    userid: user._id,
    // Map cart items to an array of product IDs
    products: cartItems.map((value) => new mongoose.Types.ObjectId(value.product._id)),
    // Set orderid using the session id
    order_id: session.id,
    // Generate a demo payment id based on the current timestamp
    payment_id: `demo ${Date.now()}`,
    // Set the total amount from the session, converting it from cents to dollars
    totalamount: session.amounttotal / 100,     });


    await userSchema.updateOne(
      { _id: user._id },
      {
        $push:{ orders:order._id },
        $set : { cart:[] },
      }
      );
     // Send a JSON response indicating a successful payment
    return  res.status(200).json({ status: "Success", message: "Payment Successful" });

}
    
// const orderId = order._id
};

  



const paymentCancel = async(req,res)=>{
    
    res.status(200).json({status:"Success" , message:"Payment cancelled"})

  }

  
  const orderProducts = async (req, res) => {

  };


  //show orders
  const showOrders = async (req, res) => {
    try {
      const userID = req.params.id;
      const user = await userSchema.findById(userID).populate('orders');
     
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const uOrder = user.orders;
  
      if (!uOrder || uOrder.length === 0) {
        return res.status(200).json({ message: "You have no orders to show" });
      }
      const orderProductDetails = await orderdb.find({ _id: { $in: uOrder } }).populate("products");
      // const orderDetails = await Order.find({ _id: { $in: userOrders } }).populate('products');
      // const populatedOrders = await orderdb.find({ _id: { $in: uOrder.map(order => order._id) } }).populate('products');

  
      // Send the order details as a JSON response
      res.status(200).json({orderProductDetails});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };









module.exports={register,
    userLogin,
    allProducts,
    specificproduct,
    categorydatas,
    addTocart,
    getCart,
    removeCart,
    addToWishlist,
    getWishlist,
    removeWishlist,
    updateCartItemQuantity,
    orderProducts,
    payment,
    paymentSuccess,
    paymentCancel,
    showOrders
    
  }