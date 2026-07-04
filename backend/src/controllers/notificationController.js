const pool = require("../config/db");

// ==============================
// Get Notifications
// ==============================

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE user_id=$1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// ==============================
// Mark Read
// ==============================

const markRead = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id=$1
      `,
      [id]
    );

    res.json({
      message: "Notification Updated",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// ==============================
// Delete Notification
// ==============================

const deleteNotification = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM notifications
      WHERE id=$1
      `,
      [id]
    );

    res.json({
      message: "Deleted",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

module.exports = {
  getNotifications,
  markRead,
  deleteNotification,
};