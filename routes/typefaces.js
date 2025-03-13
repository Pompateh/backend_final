const express = require("express");
const router = express.Router();
const Typeface = require("../models/Typeface");

// Create a new typeface
router.post("/", async (req, res) => {
  try {
    const newTypeface = new Typeface(req.body);
    await newTypeface.save();
    res.status(201).json(newTypeface);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const typefaces = await Typeface.find();
    res.json(typefaces);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

// Get a specific typeface by ID
router.get("/:id", async (req, res) => {
  try {
    const typeface = await Typeface.findById(req.params.id);
    if (!typeface) {
      return res.status(404).json({ message: "Typeface not found" });
    }
    res.json(typeface);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a typeface
router.put("/:id", async (req, res) => {
  try {
    const updatedTypeface = await Typeface.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTypeface) {
      return res.status(404).json({ message: "Typeface not found" });
    }
    res.json(updatedTypeface);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a typeface
router.delete("/:id", async (req, res) => {
  try {
    const deletedTypeface = await Typeface.findByIdAndDelete(req.params.id);
    if (!deletedTypeface) {
      return res.status(404).json({ message: "Typeface not found" });
    }
    res.json({ message: "Typeface deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;