import { v2 as cloudinary } from 'cloudinary';
import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));

// Cloudinary URL in the format: cloudinary://api_key:api_secret@cloud_name
const cloudinaryUrl = 'cloudinary://952415125251862:GvZe59xuqSRbPFliL-kdYT9K6ac@dx6wbnk27';

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html")
})

// Parse the Cloudinary URL
const cloudinaryConfig = cloudinaryUrlParser(cloudinaryUrl);

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret
});

// Configure multer to handle file uploads
const upload = multer({ dest: "uploads/" });


app.post("/", upload.single("myImage"), async function(req, res) {
  const imageFile = req.file; // Get the uploaded image file
  if (!imageFile) {
    return res.status(400).send("No image file uploaded.");
  }

  try {
    const result = await cloudinary.uploader.upload(imageFile.path); // Upload the image
    console.log("Upload result:", result);
    res.send("<h1>success</h1>");
    
    // Render the index.html page with the uploaded image URL
    // res.render(__dirname + "/index.html", { imageUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send("An error occurred while uploading the image to Cloudinary");
  }
});

function cloudinaryUrlParser(url) {
  const [, api_key, api_secret, cloud_name] = url.match(/cloudinary:\/\/([^:]+):([^@]+)@([^/]+)/);
  return { cloud_name, api_key, api_secret };
}

app.listen(3000,function(req,res){
  console.log("Started");
});
