const express = require('express');
const { Op } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateGroup, validateVenue } = require('../../utils/validation');
const { requireAuth, isOrganizer, isOrganizerCoHost, isOrganizerCoHostVenue } = require('../../utils/auth');

const router = express.Router();

// Middlewares:

// Route handlers:
// Feature 1: group endpoints
// Feature 2: venue endpoints
// Feature 3: event endpoints
// 11. Get all Events
router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'description', 'capacity', 'price']
        },
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ],
        order: [['id', 'asc']]
    });

    const payload = [];
    for (let event of events) {
        const eventData = event.toJSON();

        // get aggregate: numAttending
        eventData.numAttending = await Attendance.count({
            where: {
                eventId: event.id,
                status: 'attending'
            }
        });

        // get previewImage
        const previewImage = await EventImage.findOne({
            where: {
                eventId: event.id,
                preview: true
            }
        });

        if (previewImage) {
            eventData.previewImage = previewImage.url;
        } else {
            eventData.previewImage = `No preview image for this event`;
        };

        payload.push(eventData);
    }
    return res.json(payload);
});
// Feature 4: membership endpoints
// Feature 5: attendance endpoints
// Feature 6: image endpoints

module.exports = router;
