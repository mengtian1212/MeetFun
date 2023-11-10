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
  sequelize,
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
// get all the event attendances of current user
router.get("/", requireAuth, async (req, res, next) => {
  const myAttendances = await Attendance.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: Event,
        attributes: ["startDate"],
      },
    ],
  });
  return res.json({
    myAttendances: myAttendances,
  });
});

module.exports = router;
