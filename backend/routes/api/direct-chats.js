const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const {
  User,
  Group,
  GroupImage,
  Event,
  EventImage,
  Membership,
  Venue,
  Attendance,
  DirectChat,
  sequelize,
  DirectMessage,
} = require("../../db/models");

const { check } = require("express-validator");
const {
  handleValidationErrors,
  validateGroup,
  validateVenue,
  validateEvent,
} = require("../../utils/validation");
const {
  requireAuth,
  isOrganizer,
  isOrganizerCoHost,
  isOrganizerCoHostVenue,
  isAttendeeByEventId,
} = require("../../utils/auth");

const router = express.Router();

// Middlewares:

// Route handlers:
// Feature 1: group endpoints
// Feature 2: venue endpoints
// Feature 3: event endpoints
// Feature 4: membership endpoints
// Feature 5: attendance endpoints
// Feature 6: image endpoints

// DirectChats
// Query for all direct chats that the session user has made
router.get("/current", async (req, res, next) => {
  const directChats = await DirectChat.findAll({
    where: {
      [Op.or]: [{ user1Id: req.user.id }, { user2Id: req.user.id }],
    },
  });

  const result = [];
  for (const directChat of directChats) {
    const otherUserId =
      directChat.user1Id !== req.user.id
        ? directChat.user1Id
        : directChat.user2Id;
    const otherUser = await User.findByPk(otherUserId);

    const dct = {
      id: directChat.id,
      otherUser: otherUserId,
      firstName: otherUser.firstName,
      lastName: otherUser.lastName,
      username: otherUser.username,
      picture: otherUser.picture,
    };

    result.push(dct);
  }
  return res.json({ directChats: result });
});

router.get("/:messageId", async (req, res, next) => {
  const directChat_query = await DirectChat.findByPk(req.params.messageId);
  if (!directChat_query) {
    return res.json({ messages: [], directChat: {} });
  }

  const directChat = {
    id: directChat_query.id,
    user1Id: directChat_query.user1Id,
    user2Id: directChat_query.user2Id,
  };

  if (
    req.user.id !== directChat.user1Id &&
    req.user.id !== directChat.user2Id
  ) {
    return res.json({ messages: [], directChat: {} });
  }

  dm_query = await DirectMessage.findAll({
    where: {
      directChatId: req.params.messageId,
    },
  });

  const result = [];
  for (const directMessage of dm_query) {
    const sender = await User.findByPk(directMessage.senderId);

    const dct = {
      id: directMessage.id,
      senderId: directMessage.senderId,
      directChatId: directMessage.directChatId,
      content: directMessage.content,
      wasEdited: directMessage.wasEdited,
      createdAt: directMessage.createdAt,
      updatedAt: directMessage.updatedAt,
      senderFirstName: sender.firstName,
      senderLastName: sender.lastName,
      senderPicture: sender.picture,
    };

    result.push(dct);
  }

  return res.json({ messages: result, directChat: directChat });
});

module.exports = router;
