const express = require('express');
const { Op } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateGroup, validateVenue, validateEvent, validateImage, isVenueExist } = require('../../utils/validation');
const { requireAuth, isOrganizer, isOrganizerCoHost, isOrganizerCoHostVenue, isOrganizerCoHostEvent, isAttendeeByEventId } = require('../../utils/auth');

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

// 17. Delete an Event specified by its id
router.delete('/:eventId', requireAuth, isOrganizerCoHostEvent, async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.eventId);
        await event.destroy();
    } catch (err) {
        console.log(err);
    }
    return res.json({
        message: "Successfully deleted"
    })
});

// Feature 4: membership endpoints
// Feature 5: attendance endpoints
// 22. Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event couldn't be found" });

    const group = await Group.findByPk(event.groupId);
    if (!group) return res.status(404).json({ message: "Group couldn't be found" });

    let isOrganizerCoHost = false;
    if (req.user) {
        const membership = await Membership.findAll({
            where: {
                userId: req.user.id,
                groupId: event.groupId,
                status: {
                    [Op.in]: ['co-host', 'organizer']
                }
            }
        });
        if (membership.length !== 0) isOrganizerCoHost = true;
    };

    let attendees = [];
    if (isOrganizerCoHost) {
        attendees = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: [{
                model: Attendance,
                where: {
                    eventId: event.id
                },
                attributes: ['status']
            }],
            order: [['id']],
        });
    } else {
        attendees = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: {
                model: Attendance,
                where: {
                    eventId: event.id,
                    status:
                    {
                        [Op.ne]: 'pending'
                    }
                },
                attributes: ['status']
            }
        });
    };

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

// 23. Request to Attend an Event based on the Event's id
router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    // Error response for event not exists
    const event = await Event.findByPk(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event couldn't be found" });

    // Authorization for req.user to be a member of the group of the event
    const membership = await Membership.findAll({
        where: {
            userId: req.user.id,
            groupId: event.groupId,
            status: {
                [Op.in]: ['member', 'co-host', 'organizer']
            }
        }
    });
    if (membership.length === 0) return res.status(403).json({ message: "Forbidden" });

    const targetAttendee = await Attendance.findOne({
        where: {
            userId: req.user.id,
            eventId: req.params.eventId
        }
    });

    if (targetAttendee && targetAttendee.status === 'pending') {
        return res.status(400).json({
            "message": "Attendance has already been requested"
        });
    };

    if (targetAttendee && targetAttendee.status !== 'pending') {
        return res.status(400).json({
            "message": "User is already an attendee of the event"
        });
    };

    if (!targetAttendee) {
        const newAttendee = await Attendance.create({
            eventId: req.params.eventId,
            userId: req.user.id,
            status: 'pending'
        });
    };

    return res.json({
        userId: req.user.id,
        status: 'pending'
    });
});

// 24. Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, isOrganizerCoHostEvent, async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);
    const { userId, status } = req.body;

    if (status === 'pending') {
        return res.status(400).json({
            "message": "Cannot change an attendance status to pending"
        });
    };

    // similar to 20, might need to add validation for userId and status
    // -- userId is a positive integer
    // status is enum
    const errors = {};
    if (!Number.isInteger(userId) || (Number.isInteger(userId) && userId <= 0)) {
        errors.userId = "User couldn't be found.";
    };
    const sta = ['attending', 'waitlist'];
    if (!sta.includes(status)) {
        errors.status = "Attendance status must be 'attending' or 'waitlist'.";
    };

    if (Object.keys(errors).length !== 0) {
        return res.status(400).json({
            message: "Validation Error",
            errors
        });
    };

    // Error response if attendance does not exist
    const targetAttendee = await Attendance.findOne({
        where: {
            userId: userId,
            eventId: req.params.eventId
        }
    });
    if (!targetAttendee) {
        return res.status(404).json({
            "message": "Attendance between the user and the event does not exist"
        });
    };

    // afterall, change the status
    targetAttendee.status = status;
    await targetAttendee.save();

    return res.json({
        id: targetAttendee.id,
        eventId: targetAttendee.eventId,
        userId: targetAttendee.userId,
        status: targetAttendee.status
    });
});

// Feature 6: image endpoints

module.exports = router;
