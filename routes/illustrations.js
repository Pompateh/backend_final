const express = require("express");
const router = express.Router();
const Illustration = require("../models/Illustration");

// Create a new illustration
router.post("/", async (req, res) => {
  try {
    const newIllustration = new Illustration(req.body);
    await newIllustration.save();
    res.status(201).json(newIllustration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const illustrations = await Illustration.find();
    res.json(illustrations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

// Get a specific illustration by ID
router.get("/:id", async (req, res) => {
  try {
    const illustration = await Illustration.findById(req.params.id);
    if (!illustration) {
      return res.status(404).json({ message: "Illustration not found" });
    }
    res.json(illustration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an illustration
router.put("/:id", async (req, res) => {
  try {
    const updatedIllustration = await Illustration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedIllustration) {
      return res.status(404).json({ message: "Illustration not found" });
    }
    res.json(updatedIllustration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an illustration
router.delete("/:id", async (req, res) => {
  try {
    const deletedIllustration = await Illustration.findByIdAndDelete(req.params.id);
    if (!deletedIllustration) {
      return res.status(404).json({ message: "Illustration not found" });
    }
    res.json({ message: "Illustration deleted successfully" });
  } catch (err) {
    console.error('Error deleting illustration:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;