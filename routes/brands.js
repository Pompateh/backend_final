const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand");

// Create a new brand
router.post("/", async (req, res) => {
  try {
    const newBrand = new Brand(req.body);
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

// Get a specific brand by ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a brand
router.put("/:id", async (req, res) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(updatedBrand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a brand
router.delete("/:id", async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;