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
// get all the group memeberships of current user
router.get("/", requireAuth, async (req, res, next) => {
  const myMemberships = await Membership.findAll({
    where: { userId: req.user.id },
  });
  return res.json({
    myMemberships: myMemberships,
  });
});

module.exports = router;
