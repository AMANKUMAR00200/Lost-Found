const pool = require("../config/db");
const { getIO } = require("../socket");

// ============================
// Send Message
// ============================
const sendMessage = async (req, res) => {
  try {
    const io = getIO();

    const senderId = req.user.id;

    const {
      receiverId,
      itemId,
      message,
      imageUrl,
      audioUrl,
      replyTo,
    } = req.body;

    // Validate message
    if (
      (!message || message.trim() === "") &&
      !imageUrl &&
      !audioUrl
    ) {
      return res.status(400).json({
        message: "Message, Image or Audio is required",
      });
    }

    // ============================
    // Block Check
    // ============================

    const blocked = await pool.query(
      `
      SELECT id
      FROM blocked_users
      WHERE
      (
        blocked_by = $1
        AND blocked_user = $2
      )
      OR
      (
        blocked_by = $2
        AND blocked_user = $1
      )
      `,
      [senderId, receiverId]
    );

    if (blocked.rows.length > 0) {
      return res.status(403).json({
        message: "You cannot send messages because one of you has blocked the other.",
      });
    }

    // ============================
    // Save Message
    // ============================

    const result = await pool.query(
      `
      INSERT INTO messages
      (
        sender_id,
        receiver_id,
        item_id,
        message,
        image_url,
        audio_url,
        reply_to
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7
      )
      RETURNING *
      `,
      [
        senderId,
        receiverId,
        itemId || null,
        message || "",
        imageUrl || null,
        audioUrl || null,
        replyTo || null,
      ]
    );

    const savedMessage = result.rows[0];

    // ============================
    // Reply Preview
    // ============================

    let replyMessage = null;

    if (savedMessage.reply_to) {
      const reply = await pool.query(
        `
        SELECT
          id,
          message
        FROM messages
        WHERE id = $1
        `,
        [savedMessage.reply_to]
      );

      if (reply.rows.length > 0) {
        replyMessage = reply.rows[0].message;
      }
    }

    // ============================
    // Live Payload
    // ============================

    const payload = {
      ...savedMessage,
      reply_message: replyMessage,
      is_seen: false,
    };

    // Receiver
    io.to(receiverId.toString()).emit(
      "receive_message",
      payload
    );

    // Sender
    io.to(senderId.toString()).emit(
      "receive_message",
      payload
    );

    // Refresh Chat List
    io.to(receiverId.toString()).emit("chat_list_updated");

    io.to(senderId.toString()).emit("chat_list_updated");

    return res.status(201).json(payload);

  } catch (error) {
    console.log("SEND MESSAGE ERROR");
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// Get Chat Messages
// ============================
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.params;

    // ============================
    // Check Block Status
    // ============================

    const blocked = await pool.query(
      `
      SELECT id
      FROM blocked_users
      WHERE
      (
        blocked_by = $1
        AND blocked_user = $2
      )
      OR
      (
        blocked_by = $2
        AND blocked_user = $1
      )
      `,
      [userId, receiverId]
    );

    const isBlocked = blocked.rows.length > 0;

    // ============================
    // Fetch Messages
    // ============================

    const result = await pool.query(
      `
      SELECT

        m.*,

        r.message AS reply_message,

        sender.name AS sender_name,

        receiver.name AS receiver_name

      FROM messages m

      LEFT JOIN messages r
      ON r.id = m.reply_to

      LEFT JOIN users sender
      ON sender.id = m.sender_id

      LEFT JOIN users receiver
      ON receiver.id = m.receiver_id

      WHERE

      (

        (m.sender_id = $1 AND m.receiver_id = $2)

        OR

        (m.sender_id = $2 AND m.receiver_id = $1)

      )

      AND NOT EXISTS
      (
        SELECT 1
        FROM deleted_messages d
        WHERE
        d.message_id = m.id
        AND d.user_id = $1
      )

      ORDER BY m.created_at ASC
      `,
      [userId, receiverId]
    );

    // ============================
    // Mark Received Messages Seen
    // ============================

    await pool.query(
      `
      UPDATE messages
      SET is_seen = TRUE
      WHERE
      sender_id = $1
      AND receiver_id = $2
      AND is_seen = FALSE
      `,
      [receiverId, userId]
    );

    return res.json({
      blocked: isBlocked,
      messages: result.rows,
    });

  } catch (error) {

    console.log("GET MESSAGE ERROR");
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });

  }
};


// ============================
// Delete Entire Chat (Only For Me)
// ============================
const deleteChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.params;

    // Get all messages in this conversation
    const messages = await pool.query(
      `
      SELECT id
      FROM messages
      WHERE
      (
        sender_id = $1
        AND receiver_id = $2
      )
      OR
      (
        sender_id = $2
        AND receiver_id = $1
      )
      `,
      [userId, receiverId]
    );

    // Nothing found
    if (messages.rows.length === 0) {
      return res.json({
        message: "No messages found",
      });
    }

    // Hide all messages for current user
    for (const msg of messages.rows) {
      await pool.query(
        `
        INSERT INTO deleted_messages
        (
          message_id,
          user_id
        )
        SELECT $1,$2
        WHERE NOT EXISTS
        (
          SELECT 1
          FROM deleted_messages
          WHERE
          message_id=$1
          AND user_id=$2
        )
        `,
        [msg.id, userId]
      );
    }

    // Refresh chat list using socket
    const io = getIO();

    io.to(userId.toString()).emit("chat_list_updated");

    res.json({
      success: true,
      message: "Conversation deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ============================
// Delete Message For Me
// ============================
const deleteForMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    // Check message exists
    const check = await pool.query(
      `
      SELECT id
      FROM messages
      WHERE id = $1
      `,
      [messageId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    // Hide message only for current user
    await pool.query(
      `
      INSERT INTO deleted_messages
      (
        message_id,
        user_id
      )

      SELECT
      $1,
      $2

      WHERE NOT EXISTS
      (
        SELECT 1
        FROM deleted_messages
        WHERE
        message_id=$1
        AND user_id=$2
      )
      `,
      [messageId, userId]
    );

    res.json({
      success: true,
      message: "Message deleted for you",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ============================
// Delete Message For Everyone
// ============================


const deleteForEveryone = async (req, res) => {
  try {

    const userId = req.user.id;

    const { messageId } = req.params;

    // Sender check
    const check = await pool.query(
      `
      SELECT
      sender_id,
      receiver_id

      FROM messages

      WHERE id=$1
      `,
      [messageId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    const msg = check.rows[0];

    if (msg.sender_id !== userId) {
      return res.status(403).json({
        message: "Only sender can delete for everyone",
      });
    }

    // Replace message
    await pool.query(
      `
      UPDATE messages
      SET

      message='This message was deleted',

      image_url=NULL,

      audio_url=NULL,

      is_deleted_everyone=TRUE

      WHERE id=$1
      `,
      [messageId]
    );

    // Socket Update

    const io = getIO();

    io.to(msg.sender_id.toString()).emit(
      "message_deleted_everyone",
      {
        messageId,
      }
    );

    io.to(msg.receiver_id.toString()).emit(
      "message_deleted_everyone",
      {
        messageId,
      }
    );

    res.json({
      success: true,
      message: "Deleted for everyone",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ============================
// Block User
// ============================
const blockUser = async (req, res) => {
  try {
    const blockedBy = req.user.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User id is required",
      });
    }

    if (blockedBy === Number(userId)) {
      return res.status(400).json({
        message: "You cannot block yourself",
      });
    }

    // Already blocked?
    const exists = await pool.query(
      `
      SELECT id
      FROM blocked_users
      WHERE
      blocked_by = $1
      AND blocked_user = $2
      `,
      [blockedBy, userId]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({
        message: "User already blocked",
      });
    }

    await pool.query(
      `
      INSERT INTO blocked_users
      (
        blocked_by,
        blocked_user
      )
      VALUES
      (
        $1,
        $2
      )
      `,
      [blockedBy, userId]
    );

    const io = getIO();

    io.to(blockedBy.toString()).emit("block_status_changed");

    res.json({
      success: true,
      blocked: true,
      message: "User blocked successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ============================
// Unblock User
// ============================
const unblockUser = async (req, res) => {
  try {

    const blockedBy = req.user.id;

    const { userId } = req.body;

    await pool.query(
      `
      DELETE FROM blocked_users
      WHERE
      blocked_by = $1
      AND blocked_user = $2
      `,
      [blockedBy, userId]
    );

    const io = getIO();

    io.to(blockedBy.toString()).emit(
      "block_status_changed"
    );

    res.json({
      success: true,
      blocked: false,
      message: "User unblocked successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ============================
// Report User
// ============================
const reportUser = async (req, res) => {
  try {

    const reportedBy = req.user.id;

    const { userId, reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Reason is required",
      });
    }

    // Prevent duplicate reports
    const exists = await pool.query(
      `
      SELECT id
      FROM reports
      WHERE
      reported_by = $1
      AND reported_user = $2
      `,
      [reportedBy, userId]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({
        message: "You already reported this user",
      });
    }

    await pool.query(
      `
      INSERT INTO reports
      (
        reported_by,
        reported_user,
        reason
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      `,
      [
        reportedBy,
        userId,
        reason,
      ]
    );

    res.json({
      success: true,
      message: "User reported successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ============================
// Chat List
// ============================
const getChatList = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT

      u.id,

      u.name,

      u.email,

      u.profile_image,

      m.id AS message_id,

      CASE

        WHEN m.is_deleted_everyone = TRUE
        THEN 'This message was deleted'

        WHEN m.image_url IS NOT NULL
        THEN '📷 Photo'

        WHEN m.audio_url IS NOT NULL
        THEN '🎤 Voice Message'

        ELSE m.message

      END AS last_message,

      m.created_at AS last_time,

      m.sender_id,

      m.receiver_id,

      m.is_seen,

      (

        SELECT COUNT(*)

        FROM messages mm

        WHERE

        mm.sender_id = u.id

        AND mm.receiver_id = $1

        AND mm.is_seen = FALSE

        AND NOT EXISTS
        (
          SELECT 1
          FROM deleted_messages dm
          WHERE
          dm.message_id = mm.id
          AND dm.user_id = $1
        )

      )::INT AS unread_count

      FROM

      (

        SELECT DISTINCT ON
        (

          CASE

            WHEN sender_id = $1

            THEN receiver_id

            ELSE sender_id

          END

        )

        *

        FROM messages

        WHERE

        sender_id = $1

        OR

        receiver_id = $1

        ORDER BY

        CASE

          WHEN sender_id = $1

          THEN receiver_id

          ELSE sender_id

        END,

        created_at DESC

      ) m

      JOIN users u

      ON

      u.id =

      CASE

        WHEN m.sender_id = $1

        THEN m.receiver_id

        ELSE m.sender_id

      END

      WHERE

      NOT EXISTS
      (

        SELECT 1

        FROM deleted_messages d

        WHERE

        d.message_id = m.id

        AND d.user_id = $1

      )

      ORDER BY

      m.created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {

    console.log("CHAT LIST ERROR");

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ============================
// Check Block Status
// ============================

const getBlockStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.params;

    const blocked = await pool.query(
      `
      SELECT *
      FROM blocked_users
      WHERE blocked_by=$1
      AND blocked_user=$2
      `,
      [userId, receiverId],
    );

    const blockedByOther = await pool.query(
      `
      SELECT *
      FROM blocked_users
      WHERE blocked_by=$1
      AND blocked_user=$2
      `,
      [receiverId, userId],
    );

    res.json({
      blocked: blocked.rows.length > 0,
      blockedByUser: blockedByOther.rows.length > 0,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================
// Mark Messages as Seen
// ============================
const markAsSeen = async (req, res) => {
  try {

    const userId = req.user.id;

    const { receiverId } = req.params;

    await pool.query(
      `
      UPDATE messages

      SET
      is_seen = TRUE

      WHERE

      sender_id = $1

      AND receiver_id = $2

      AND is_seen = FALSE
      `,
      [receiverId, userId]
    );

    const io = getIO();

    io.to(receiverId.toString()).emit(
      "messages_seen",
      {
        by: userId,
      }
    );

    res.json({
      success: true,
      message: "Messages marked as seen",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ============================
// Exports
// ============================

module.exports = {
  sendMessage,
  getMessages,

  getChatList,

  deleteChat,

  deleteForMe,

  deleteForEveryone,

  blockUser,

  unblockUser,

  getBlockStatus,

  reportUser,

  markAsSeen,
};
