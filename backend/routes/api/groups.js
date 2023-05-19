const express = require('express');
const { Op } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateGroup, validateVenue, validateEvent } = require('../../utils/validation');
const { requireAuth, isOrganizer, isOrganizerCoHost, isOrganizerCoHostVenue } = require('../../utils/auth');

const router = express.Router();

// Middlewares:

// Route handlers:
// Feature 1: group endpoints
// 1. Get all groups:
router.get('/', async (req, res, next) => {
    const groups = await Group.findAll({
        order: [['id', 'ASC']]
    });

    const result = [];
    for (let group of groups) {
        groupData = group.toJSON();

        // get aggregate: numMembers
        const numMembers = await Membership.count({
            where: {
                groupId: groupData.id,
                status: {
                    [Op.in]: ['member', 'co-host', 'organizer']
                }
            }
        });

        // get previewImage
        const previewImage = await GroupImage.findOne({
            where: {
                groupId: group.id,
                preview: true
            }
        });

        // add correct date format, numMembers, previewImage
        groupData.createdAt = groupData.createdAt.toISOString().slice(0, 10) + ' ' + groupData.createdAt.toISOString().slice(11, 19);
        groupData.updatedAt = groupData.updatedAt.toISOString().slice(0, 10) + ' ' + groupData.updatedAt.toISOString().slice(11, 19);
        groupData.numMembers = numMembers;

        if (previewImage) {
            groupData.previewImage = previewImage.url;
        }
        else {
            groupData.previewImage = `No preview image for this group`;
        }

        result.push(groupData);
    };

    return res.json({ Groups: result });
});

// 2. Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const groups = await Group.findAll({
        include: [
            {
                model: Membership,
                where: {
                    userId: req.user.id,
                    status: {
                        [Op.in]: ['member', 'co-host', 'organizer']
                    },
                },
                attributes: []
            }
        ],
        order: [['id', 'ASC']]
    });

    const result = [];
    for (let group of groups) {
        const groupData = group.toJSON();
        groupData.createdAt = groupData.createdAt.toISOString().slice(0, 10) + ' ' + groupData.createdAt.toISOString().slice(11, 19);
        groupData.updatedAt = groupData.updatedAt.toISOString().slice(0, 10) + ' ' + groupData.updatedAt.toISOString().slice(11, 19);

        // get aggregate: numMembers
        groupData.numMembers = await Membership.count({
            where: {
                groupId: groupData.id,
                status: {
                    [Op.in]: ['member', 'co-host', 'organizer']
                }
            }
        });

        // get previewImage
        const previewImage = await GroupImage.findOne({
            where: {
                groupId: group.id,
                preview: true
            }
        });

        if (previewImage) {
            groupData.previewImage = previewImage.url;
        }
        else {
            groupData.previewImage = `No preview image for this group`;
        };

        result.push(groupData);
    }
    return res.json({ Groups: result });
});

// 3. Get details of a Group from an id
router.get('/:groupId', async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Organizer',
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Venue,
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
            }
        ]
    });

    // get aggregate: numMembers
    const numMembers = await Membership.count({
        where: {
            groupId: req.params.groupId,
            status: {
                [Op.in]: ['member', 'co-host', 'organizer']
            }
        }
    });

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        err.title = "Group couldn't be found";
        next(err);
    } else {
        const result = group.toJSON();
        result.createdAt = group.createdAt.toISOString().slice(0, 10) + ' ' + group.createdAt.toISOString().slice(11, 19);
        result.updatedAt = group.updatedAt.toISOString().slice(0, 10) + ' ' + group.updatedAt.toISOString().slice(11, 19);
        result.numMembers = numMembers;
        return res.json(result);
    }
});

// 4. Create a Group
router.post('/', requireAuth, validateGroup, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const group = await Group.create({
        organizerId: req.user.id,
        name, about, type, private, city, state,
    });

    const membership = await Membership.create({
        userId: req.user.id,
        groupId: group.id,
        status: 'organizer'
    });

    return res.status(201).json(group);
});

// 5. Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, isOrganizer, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    const { url, preview } = req.body;

    const image = await GroupImage.create({
        groupId: req.params.groupId,
        url,
        preview
    });

    return res.json({
        id: image.id,
        url: image.url,
        preview: image.preview
    });
});

// 6. Edit a Group
router.put('/:groupId', requireAuth, isOrganizer, validateGroup, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;

    const group = await Group.findByPk(req.params.groupId);

    if (name) group.name = name;
    if (about) group.about = about;
    if (type) group.type = type;
    if (private) group.private = private;
    if (city) group.city = city;
    if (state) group.state = state;
    await group.save();
    const updatedGroup = await Group.findByPk(req.params.groupId);
    return res.json(updatedGroup);

});

// 7. Delete a Group
router.delete('/:groupId', requireAuth, isOrganizer, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    try {
        await group.destroy();
    } catch (err) {
        console.log(err);
    }
    return res.json({
        message: "Successfully deleted"
    });
});

// Feature 2: venue endpoints
// 8. Get All Venues for a Group specified by its id
router.get('/:groupId/venues', requireAuth, isOrganizerCoHost, async (req, res, next) => {
    const venues = await Venue.findAll({
        where: {
            groupId: req.params.groupId
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        order: [['id', 'asc']]
    });

    return res.json({ Venues: venues });
});

// 9. Create a new Venue for a Group specified by its id
router.post('/:groupId/venues', requireAuth, isOrganizerCoHost, validateVenue, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;
    const venue = await Venue.create({
        groupId: req.params.groupId,
        address, city, state, lat, lng
    });

    return res.status(200).json({
        id: venue.id,
        groupId: venue.groupId,
        address, city, state, lat, lng
    });
});

// Feature 3: event endpoints
// 12. Get all Events of a Group specified by its id
router.get('/:groupId/events', async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    console.log(group);
    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        err.title = "Group couldn't be found";
        next(err);
    } else {
        const events = await Event.findAll({
            where: {
                groupId: req.params.groupId
            },
            attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate'],
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
        };
        return res.json({ Events: payload });
    };
});

// 14. Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, isOrganizerCoHost, validateEvent, async (req, res, next) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const event = await Event.create({
        groupId: req.params.groupId,
        venueId, name, type, capacity, price, description, startDate, endDate
    });
    return res.json(event);

});

// Feature 4: membership endpoints
// Feature 5: attendance endpoints
// Feature 6: image endpoints

module.exports = router;
