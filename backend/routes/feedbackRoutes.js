import express from "express";
import { Feedback } from "../models/Feedback.js";

const router = express.Router();

// POST /api/feedback - Add feedback
router.post("/feedback", async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (rating == null) {
      return res.status(400).json({ error: "Rating is required" });
    }
    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const feedback = await Feedback.create({
      name: name.trim(),
      email: email?.trim() || "",
      message: message.trim(),
      rating: numericRating
    });

    return res.status(201).json(feedback);
  } catch (err) {
    console.error("Error creating feedback:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/feedback - Get all feedback
router.get("/feedback", async (_req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/stats - Get stats
router.get("/stats", async (_req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          positiveCount: {
            $sum: {
              $cond: [{ $gte: ["$rating", 4] }, 1, 0]
            }
          },
          negativeCount: {
            $sum: {
              $cond: [{ $lte: ["$rating", 2] }, 1, 0]
            }
          }
        }
      }
    ]);

    if (!stats.length) {
      return res.json({
        totalFeedbacks: 0,
        averageRating: 0,
        positiveCount: 0,
        negativeCount: 0
      });
    }

    const result = stats[0];
    return res.json({
      totalFeedbacks: result.totalFeedbacks,
      averageRating: Number(result.averageRating.toFixed(2)),
      positiveCount: result.positiveCount,
      negativeCount: result.negativeCount
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
