const pool = require("../config/db");

// Create Claim
const claimItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    const claimantId = req.user.id;

    const exists = await pool.query(
      `SELECT *
       FROM claims
       WHERE item_id = $1
       AND claimant_id = $2`,
      [itemId, claimantId]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({
        message: "You have already claimed this item",
      });
    }

    const result = await pool.query(
      `INSERT INTO claims (item_id, claimant_id)
       VALUES ($1, $2)
       RETURNING *`,
      [itemId, claimantId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Claims
const getMyClaims = async (req, res) => {
  try {
    const claimantId = req.user.id;

    const result = await pool.query(
      `SELECT
          claims.id,
          claims.status,
          claims.created_at,
          items.title,
          items.type,
          items.location,
          items.description,
          items.image_url
       FROM claims
       JOIN items
         ON claims.item_id = items.id
       WHERE claims.claimant_id = $1
       ORDER BY claims.created_at DESC`,
      [claimantId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  claimItem,
  getMyClaims,
};