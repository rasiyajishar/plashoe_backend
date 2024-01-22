const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs=require("fs")
const storage = multer.diskStorage({
    destination: "Uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  });
  const upload = multer({ storage });


          
cloudinary.config({ 
  cloud_name: 'dlweshii1', 
  api_key: '348665113567648', 
  api_secret: 'DEL8csNSMNfyd-KvH-Y9sTo0UF4' 
});



//   const imageController = (req, res, next) => {
//     upload.single("image")(req, res, async (err) => {
//       if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded." });
//       }
  
//       const { filename, size } = req.file;
  
//       res.json({ message: "File uploaded successfully", filename, size });
//     });
//   };



const imagecontroller = (req, res, next) => {
    console.log(req);
    upload.single("image")(req, res, async (err) => {
      if (err) { return res.status(400).json({ message: "Image upload failed" }) }
  
      try {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'products'})
        req.imageUrl = result.secure_url;

        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete local image file:", unlinkErr);
          }
        });


        next();
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Failed to upload image to Cloudinary" });
      }
    });
  };
  
  module.exports = imagecontroller;