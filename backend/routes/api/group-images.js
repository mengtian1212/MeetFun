const express = require('express');
const { Op } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateGroup, validateVenue, validateEvent } = require('../../utils/validation');
const { requireAuth, isOrganizerCoHostGroupImage } = require('../../utils/auth');

const router = express.Router();

// Middlewares:
// Route handlers:
// Feature 1: group endpoints
// Feature 2: venue endpoints
// Feature 3: event endpoints
// Feature 4: membership endpoints
// Feature 5: attendance endpoints
// Feature 6: image endpoints
// 26. Delete an Image for a Group
router.delete('/:imageId', requireAuth, isOrganizerCoHostGroupImage, async (req, res, next) => {
    const image = await GroupImage.findByPk(req.params.imageId);
    await image.destroy();
    return res.json({
        message: "Successfully deleted"
    });
});

module.exports = router;
