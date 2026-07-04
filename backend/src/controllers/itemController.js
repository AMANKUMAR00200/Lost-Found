const pool = require("../config/db");


// ==============================
// Create Item
// ==============================
const createItem = async (req, res) => {
  try {

    console.log("========== CREATE ITEM ==========");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const {
      type,
      title,
      description,
      location,
      image_url,
      contact_number,
      reward,
      lost_found_date,
      lost_found_time,
    } = req.body;

    const userId = req.user.id;

    // Basic Validation
    if (
      !type ||
      !title ||
      !description ||
      !location ||
      !contact_number ||
      !lost_found_date ||
      !lost_found_time
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO items
      (
        user_id,
        type,
        title,
        description,
        location,
        image_url,
        contact_number,
        reward,
        lost_found_date,
        lost_found_time,
        status
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'open'
      )
      RETURNING *
      `,
      [
        userId,
        type,
        title.trim(),
        description.trim(),
        location.trim(),
        image_url || null,
        contact_number.trim(),
        reward || 0,
        lost_found_date,
        lost_found_time,
      ]
    );

    res.status(201).json({
      message: "Item reported successfully",
      item: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ==============================
// Get All Items
// ==============================
const getItems = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id DESC");

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get My Items
// ==============================
const getMyItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT *
       FROM items
       WHERE user_id=$1
       ORDER BY id DESC`,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get Single Item
// ==============================
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        items.*,
        users.name,
        users.email
      FROM items
      JOIN users
        ON items.user_id = users.id
      WHERE items.id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Item
// ==============================
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      location,
      contact_number,
      reward,
      lost_found_time,
      status,
    } = req.body;

    const userId = req.user.id;
    const role = req.user.role;

    let result;

    if (role === "admin") {
      // Admin kisi bhi item ko update kar sakta hai
      result = await pool.query(
        `UPDATE items
SET
title = $1,
description = $2,
location = $3,
contact_number = $4,
reward = $5,
lost_found_time = $6,
status = $7
WHERE id = $8
RETURNING *`,
        [
          title,
          description,
          location,
          contact_number,
          reward,
          lost_found_time,
          status,
          id,
        ],
      );
    } else {
      // Student sirf apna item update kar sakta hai
      result = await pool.query(
        `UPDATE items
         SET title = $1,
             description = $2,
             location = $3,
             status = $4
         WHERE id = $5
         AND user_id = $6
         RETURNING *`,
        [title, description, location, status, id, userId],
      );
    }

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "You are not allowed to edit this item",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ==============================
// Delete Item
// ==============================
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;
    const role = req.user.role;

    let result;

    if (role === "admin") {
      // Admin kisi bhi item ko delete kar sakta hai
      result = await pool.query(
        `DELETE FROM items
         WHERE id = $1
         RETURNING *`,
        [id],
      );
    } else {
      // Student sirf apna item delete kar sakta hai
      result = await pool.query(
        `DELETE FROM items
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [id, userId],
      );
    }

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "You are not allowed to delete this item",
      });
    }

    res.json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createItem,
  getItems,
  getMyItems,
  getItemById,
  updateItem,
  deleteItem,
};
