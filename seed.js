const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Brand = require("./models/Brand");
const Illustration = require("./models/Illustration");
const Product = require("./models/Product");
const Typeface = require("./models/Typeface");

const path = require("path");

const brandsData = require(path.join(__dirname, "data", "brands.json"));
const illustrationsData = require(path.join(__dirname, "data", "illustrations.json"));
const productsData = require(path.join(__dirname, "data", "products.json"));
const typefacesData = require(path.join(__dirname, "data", "typeface.json"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://heetranwork:31122000h@cluster0.x8whi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const importData = async () => {
  try {
    await Brand.deleteMany();
    await Illustration.deleteMany();
    await Product.deleteMany();
    await Typeface.deleteMany();

    await Brand.insertMany(brandsData);
    await Illustration.insertMany(illustrationsData);
    await Product.insertMany(productsData);
    await Typeface.insertMany(typefacesData);

    console.log("✅ Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error with data import:", error);
    process.exit(1);
  }
};

// Only run the seed if SEED_DATA environment variable is set to "true"
if (process.env.SEED_DATA === "true") {
  importData();
} else {
  console.log("Seeding skipped. Set SEED_DATA=true to import seed data.");
}
