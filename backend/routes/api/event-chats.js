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
  EventChat,
  EventMessage,
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
// EventChats
// Query for all event chats that the session user's attendance is
// either 'organizer' or 'attending'
router.get("/current", async (req, res, next) => {
  const myAttendances = await Attendance.findAll({
    where: {
      userId: req.user.id,
      status: {
        [Op.in]: ["organizer", "attending"],
      },
    },
    attributes: ["eventId"],
  });

  const eventIds = myAttendances.map((record) => record.eventId);
  const eventsAttended = await Event.findAll({
    where: {
      id: eventIds,
    },
    include: [
      {
        model: EventImage,
        attributes: ["id", "url", "preview"],
        where: {
          preview: true,
        },
      },
      {
        model: EventChat,
        attributes: ["id"],
      },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"],
      },
    ],
  });

  const result = [];
  for (const event of eventsAttended) {
    const dct = {
      eventChatId: event.EventChat.id,
      eventId: event.id,
      eventName: event.name,
      eventImage: event.EventImages.length ? event.EventImages[0].url : "",
      eventStartDate: event.startDate,
      eventVenueAddress: event.Venue.address,
      eventVenueCity: event.Venue.city,
      eventVenueState: event.Venue.state,
    };
    result.push(dct);
  }
  console.log("myAttendances", eventsAttended);

  return res.json({ eventChats: result });
});

router.get("/:eventChatId", async (req, res, next) => {
  const eventChat_query = await EventChat.findByPk(req.params.eventChatId);
  if (!eventChat_query) {
    return res.json({ messages: [], eventChat: {} });
  }

  const eventChat = {
    id: eventChat_query.id,
    eventId: eventChat_query.eventId,
  };

  dm_query = await EventMessage.findAll({
    where: {
      eventChatId: req.params.eventChatId,
    },
  });

  const result = [];
  for (const eventMessage of dm_query) {
    const sender = await User.findByPk(eventMessage.senderId);
    const dct = {
      id: eventMessage.id,
      senderId: eventMessage.senderId,
      eventChatId: eventMessage.eventChatId,
      content: eventMessage.content,
      wasEdited: eventMessage.wasEdited,
      createdAt: eventMessage.createdAt,
      updatedAt: eventMessage.updatedAt,
      senderFirstName: sender.firstName,
      senderLastName: sender.lastName,
      senderPicture: sender.picture,
    };
    result.push(dct);
  }

  return res.json({ messages: result, eventChat: eventChat });
});

module.exports = router;
