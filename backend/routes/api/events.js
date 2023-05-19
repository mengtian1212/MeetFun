const express = require('express');
const { Op } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateGroup, validateVenue, validateEvent, validateImage, isVenueExist } = require('../../utils/validation');
const { requireAuth, isOrganizer, isOrganizerCoHost, isOrganizerCoHostVenue, isOrganizerCoHostEvent, isAttendeeByEventId } = require('../../utils/auth');
const venue = require('../../db/models/venue');

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
    return res.json({ Events: payload });
});

// 13. Get details of an Event specified by its id
router.get('/:eventId', async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId, {
        attributes: ['id', 'groupId', 'venueId', 'name', 'description', 'type', 'capacity', 'price', 'startDate', 'endDate'],
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'private', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
            },
            {
                model: EventImage,
                attributes: ['id', 'url', 'preview']
            }
        ]
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
                status: 'attending'
            }
        });
        return res.json(eventData);
    }
});

// 15. Add an Image to a Event based on the Event's id
router.post('/:eventId/images', requireAuth, isAttendeeByEventId, validateImage, async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);
    const { url, preview } = req.body;

    const image = await EventImage.create({
        eventId: req.params.eventId,
        url,
        preview
    });

    return res.json({
        id: image.id,
        url: image.url,
        preview: image.preview
    });
});

// 16. Edit an Event specified by its id
router.put('/:eventId', requireAuth, isOrganizerCoHostEvent, isVenueExist, validateEvent, async (req, res, next) => {
    try {
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

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
        console.log(err);
    }

    const updatedEvent = await Event.findByPk(req.params.eventId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });

    return res.json(updatedEvent);
});
// Feature 4: membership endpoints
// Feature 5: attendance endpoints
// Feature 6: image endpoints

module.exports = router;
