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
  EventChat,
  sequelize,
} = require("../../db/models");

const { check } = require("express-validator");
const {
  handleValidationErrors,
  validateGroup,
  validateVenue,
  validateEvent,
  validateImage,
  isVenueExist,
  queryValidationCheck,
} = require("../../utils/validation");
const {
  requireAuth,
  isOrganizer,
  isOrganizerCoHost,
  isOrganizerCoHostVenue,
  isOrganizerCoHostEvent,
  isAttendeeByEventId,
  checkDeletedAttendee,
} = require("../../utils/auth");

const router = express.Router();

// Middlewares:
// Route handlers:
// Feature 1: group endpoints
// Feature 2: venue endpoints
// Feature 3: event endpoints
// 11. Get all Events
router.get("/", queryValidationCheck, async (req, res, next) => {
  // Endpoint 27. Add Query Filters to Get All Events
  let { page, size, name, type, startDate } = req.query;

  // After Query parameter validation check, construct queryOptions object
  let queryOptions = {
    where: {},
  };
  // Pagination
  page = parseInt(page);
  size = parseInt(size);
  // default page and size:
  if (Number.isNaN(page)) page = 1;
  if (Number.isNaN(size)) size = 20;

  // // maximum page and size:
  // if (Number.isInteger(page) && page > 10) page = 10;
  // if (Number.isInteger(size) && size > 20) size = 20;
  queryOptions.limit = size;
  queryOptions.offset = size * (page - 1);
  // console.log(page, size, queryOptions.limit, queryOptions.offset);

  // Search filters
  if (name) {
    queryOptions.where.name = {
      [Op.like]: `%${name}%`,
    };
  }
  // console.log(name, queryOptions.where.name);
  if (type) {
    queryOptions.where.type = type;
  }
  // console.log(type, queryOptions.where.type);
  if (startDate) {
    queryOptions.where.startDate = {
      [Op.gt]: new Date(startDate),
    };
  }
  // console.log("my query", queryOptions);

  ////////////
  const events = await Event.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt", "capacity", "price"],
    },
    include: [
      {
        model: EventChat,
        attributes: ["id"],
      },
      {
        model: Group,
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
    ],
    order: [["id", "asc"]],
    ...queryOptions, // 27. Add Query Filters to Get All Events
  });

  const payload = [];
  for (let event of events) {
    const eventData = event.toJSON();

    // get aggregate: numAttending
    eventData.numAttending = await Attendance.count({
      where: {
        eventId: event.id,
        status: {
          [Op.in]: ["organizer", "attending"],
        },
      },
    });

    // get previewImage
    const previewImage = await EventImage.findOne({
      where: {
        eventId: event.id,
        preview: true,
      },
    });

    if (previewImage) {
      eventData.previewImage = previewImage.url;
    } else {
      eventData.previewImage = `No preview image for this event`;
    }

    payload.push(eventData);
  }
  return res.json({ Events: payload });
});

router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const events = await Event.findAll({
    include: {
      model: Attendance,
      where: { userId: userId },
      attributes: [],
    },
  });
  return res.json({ Events: events });
});

// 13. Get details of an Event specified by its id
router.get("/:eventId", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "description",
      "type",
      "capacity",
      "price",
      "startDate",
      "endDate",
    ],
    include: [
      {
        model: EventChat,
        attributes: ["id"],
      },
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"],
      },
      {
        model: EventImage,
        attributes: ["id", "url", "preview"],
      },
    ],
  });

  if (!event) {
    const err = new Error("Event couldn't be found");
    err.status = 404;
    err.title = "Event couldn't be found";
    next(err);
  } else {
    const eventData = event.toJSON();
    eventData.numAttending = await Attendance.count({
      where: {
        eventId: event.id,
        status: {
          [Op.in]: ["organizer", "attending"],
        },
      },
    });
    return res.json(eventData);
  }
});

// 15. Add an Image to a Event based on the Event's id
router.post(
  "/:eventId/images",
  requireAuth,
  isAttendeeByEventId,
  validateImage,
  async (req, res, next) => {
    const { url, preview } = req.body;

    const image = await EventImage.create({
      eventId: req.params.eventId,
      url,
      preview,
    });

    return res.json({
      id: image.id,
      url: image.url,
      preview: image.preview,
    });
  }
);

// 16. Edit an Event specified by its id
router.put(
  "/:eventId",
  requireAuth,
  isOrganizerCoHostEvent,
  isVenueExist,
  validateEvent,
  async (req, res, next) => {
    try {
      const {
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      } = req.body;

      const event = await Event.findByPk(req.params.eventId);
      if (!isNaN(venueId)) event.venueId = venueId;
      if (name) event.name = name;
      if (type) event.type = type;
      if (capacity) event.capacity = capacity;
      if (price) event.price = price;
      if (description) event.description = description;
      if (startDate) event.startDate = startDate;
      if (endDate) event.endDate = endDate;
      await event.save();
    } catch (err) {
      err.status = 400;
      // console.log(err);
      return next(err);
    }

    const updatedEvent = await Event.findByPk(req.params.eventId, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    return res.json(updatedEvent);
  }
);

// 17. Delete an Event specified by its id
router.delete(
  "/:eventId",
  requireAuth,
  isOrganizerCoHostEvent,
  async (req, res, next) => {
    try {
      const event = await Event.findByPk(req.params.eventId);
      await event.destroy();
    } catch (err) {
      console.log(err);
    }
    return res.json({
      message: "Successfully deleted",
    });
  }
);

// Feature 4: membership endpoints
// Feature 5: attendance endpoints
// 22. Get all Attendees of an Event specified by its id
router.get("/:eventId/attendees", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId);
  if (!event)
    return res.status(404).json({ message: "Event couldn't be found" });

  const group = await Group.findByPk(event.groupId);
  if (!group)
    return res.status(404).json({ message: "Group couldn't be found" });

  let isOrganizerCoHost = false;
  if (req.user) {
    const cohostFound = await Membership.findAll({
      where: {
        userId: req.user.id,
        groupId: event.groupId,
        status: "co-host",
      },
    });
    if (req.user.id === group.organizerId || cohostFound.length !== 0)
      isOrganizerCoHost = true;
  }
  console.log("isOrganizerCoHost", isOrganizerCoHost);
  let attendees = [];
  if (isOrganizerCoHost) {
    attendees = await User.findAll({
      attributes: ["id", "firstName", "lastName", "picture"],
      include: [
        {
          model: Attendance,
          where: {
            eventId: event.id,
          },
          attributes: ["id", "status", "updatedAt"],
        },
      ],
      order: [["id"]],
    });
  } else {
    attendees = await User.findAll({
      attributes: ["id", "firstName", "lastName", "picture"],
      include: {
        model: Attendance,
        where: {
          eventId: event.id,
          status: {
            [Op.ne]: "pending",
          },
        },
        attributes: ["id", "status", "updatedAt"],
      },
    });
  }

  const payload = [];
  for (let attendee of attendees) {
    const attendeeData = attendee.toJSON();
    attendeeData.Attendance = attendeeData.Attendances;
    delete attendeeData.Attendances;
    payload.push(attendeeData);
  }

  payload.sort((a, b) => a.id - b.id);
  return res.json({ Attendees: payload });
});

// additional. Get all attendances of a Event specified by its id
router.get("/:eventId/attendances", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId);
  if (!event)
    return res.status(404).json({ message: "Event couldn't be found" });

  const attendances = await event.getAttendances();
  return res.json({
    Attendances: attendances,
  });
});

// 23. Request to Attend an Event based on the Event's id
router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
  // Error response for event not exists
  const event = await Event.findByPk(req.params.eventId);
  if (!event)
    return res.status(404).json({ message: "Event couldn't be found" });

  // Authorization for req.user to be a member of the group of the event
  const membership = await Membership.findAll({
    where: {
      userId: req.user.id,
      groupId: event.groupId,
      status: {
        [Op.in]: ["member", "co-host"],
      },
    },
  });

  // Here, no need to join the group to attend event
  // if (membership.length === 0)
  //   return res.status(403).json({ message: "Forbidden" });

  const targetAttendee = await Attendance.findOne({
    where: {
      userId: req.user.id,
      eventId: req.params.eventId,
    },
  });

  if (targetAttendee && targetAttendee.status === "pending") {
    return res.status(400).json({
      message: "Attendance has already been requested",
    });
  }

  if (targetAttendee && targetAttendee.status !== "pending") {
    return res.status(400).json({
      message: "User is already an attendee of the event",
    });
  }

  if (!targetAttendee) {
    const newAttendee = await Attendance.create({
      eventId: req.params.eventId,
      userId: req.user.id,
      status: "pending",
    });
    return res.json({
      id: newAttendee.id,
      userId: req.user.id,
      eventId: newAttendee.eventId,
      status: "pending",
    });
  }
});

// 24. Change the status of an attendance for an event specified by id
router.put(
  "/:eventId/attendance",
  requireAuth,
  isOrganizerCoHostEvent,
  async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);
    const { userId, status } = req.body;

    if (status === "pending") {
      return res.status(400).json({
        message: "Cannot change an attendance status to pending",
      });
    }

    // similar to 20, might need to add validation for userId and status
    // -- userId is a positive integer
    // status is enum
    const errors = {};
    if (
      !Number.isInteger(userId) ||
      (Number.isInteger(userId) && userId <= 0)
    ) {
      errors.userId = "userId is invalid";
    }
    const sta = ["organizer", "attending"];
    if (!sta.includes(status)) {
      errors.status = "Attendance status must be 'organizer' or 'attending'.";
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(400).json({
        message: "Validation Error",
        errors,
      });
    }

    // Error response if attendance does not exist
    const targetAttendee = await Attendance.findOne({
      where: {
        userId: userId,
        eventId: req.params.eventId,
      },
    });
    if (!targetAttendee) {
      return res.status(404).json({
        message: "Attendance between the user and the event does not exist",
      });
    }

    // afterall, change the status
    targetAttendee.status = status;
    await targetAttendee.save();

    return res.json({
      id: targetAttendee.id,
      eventId: targetAttendee.eventId,
      userId: targetAttendee.userId,
      status: targetAttendee.status,
    });
  }
);

// 25. Delete attendance to an event specified by id
router.delete(
  "/:eventId/attendance",
  requireAuth,
  checkDeletedAttendee,
  async (req, res, next) => {
    const { userId } = req.body;

    // might need to add validation for userId being deleted
    if (
      !Number.isInteger(userId) ||
      (Number.isInteger(userId) && userId <= 0)
    ) {
      return res.status(400).json({
        message: "Validation Error",
        errors: {
          userId: "User couldn't be found",
        },
      });
    }

    // Error response if userId being deleted cannot be found in the user table
    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      return res.status(400).json({
        message: "Validation Error",
        errors: {
          userId: "User couldn't be found",
        },
      });
    }

    const attendance = await Attendance.findOne({
      where: {
        userId: userId,
        eventId: req.params.eventId,
      },
    });
    if (!attendance) {
      return res.status(404).json({
        message: "Attendance does not exist for this User",
      });
    }

    await attendance.destroy();
    return res.json({
      message: "Successfully deleted attendance from event",
    });
  }
);

// Feature 6: image endpoints
// Feature 7: query
// 27. Add Query Filters to Get All Events

module.exports = router;
