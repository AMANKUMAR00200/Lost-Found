const pool = require("../config/db");

const findMatches = async (req, res) => {
  try {
    const lostItems = await pool.query(
      "SELECT * FROM items WHERE type='lost' AND status='open'"
    );

    const foundItems = await pool.query(
      "SELECT * FROM items WHERE type='found' AND status='open'"
    );

    const matches = [];

    for (const lost of lostItems.rows) {
      for (const found of foundItems.rows) {
        let score = 0;
        const reasons = [];

        // -----------------------
        // Title Match (40)
        // -----------------------

        const lostTitle = (lost.title || "").toLowerCase();
        const foundTitle = (found.title || "").toLowerCase();

        if (
          lostTitle &&
          foundTitle &&
          (lostTitle.includes(foundTitle) ||
            foundTitle.includes(lostTitle))
        ) {
          score += 40;
          reasons.push("Same Title");
        }

        // -----------------------
        // Description Match (25)
        // -----------------------

        const lostDesc = (lost.description || "").toLowerCase();
        const foundDesc = (found.description || "").toLowerCase();

        const lostWords = lostDesc.split(/\s+/);
        const foundWords = foundDesc.split(/\s+/);

        const commonWords = lostWords.filter(
          (word) => word.length > 2 && foundWords.includes(word)
        );

        if (commonWords.length >= 2) {
          score += 25;
          reasons.push("Similar Description");
        }

        // -----------------------
        // Location Match (20)
        // -----------------------

        const lostLocation = (lost.location || "").toLowerCase();
        const foundLocation = (found.location || "").toLowerCase();

        if (
          lostLocation &&
          foundLocation &&
          (lostLocation.includes(foundLocation) ||
            foundLocation.includes(lostLocation))
        ) {
          score += 20;
          reasons.push("Same Location");
        }

        // -----------------------
        // Reward Bonus (5)
        // -----------------------

        if (lost.reward) {
          score += 5;
        }

        // -----------------------
        // Contact Bonus (5)
        // -----------------------

        if (lost.contact_number) {
          score += 5;
        }

        // -----------------------
        // Image Bonus (5)
        // -----------------------

        if (lost.image_url && found.image_url) {
          score += 5;
          reasons.push("Both Have Images");
        }

        // -----------------------
        // Minimum Score
        // -----------------------

        if (score >= 40) {
          matches.push({
            score,
            reasons,
            lost,
            found,
          });
        }
      }
    }

    matches.sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  findMatches,
};