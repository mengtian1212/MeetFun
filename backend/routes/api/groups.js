const express = require('express');
const { Op } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateGroup, validateVenue, validateEvent, validateImage } = require('../../utils/validation');
const { requireAuth,
    isOrganizer, isOrganizerCoHost, isOrganizerCoHostVenue,
    isOrganizerFun, isOrganizerCohostFun,
    checkDeletedMember } = require('../../utils/auth');

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
router.post('/:groupId/images', requireAuth, isOrganizer, validateImage, async (req, res, next) => {
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
    if (!isNaN(private)) group.private = private;
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
        venueId: (venueId) ? venueId : null,
        name, type, capacity, price, description, startDate, endDate
    });

    return res.json({
        id: event.id,
        groupId: req.params.groupId,
        venueId: (venueId) ? venueId : null,
        name, type, capacity, price, description, startDate, endDate
    });
});

// Feature 4: membership endpoints
// 18. Get all Members of a Group specified by its id
router.get('/:groupId/members', async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group couldn't be found" });

    let isOrganizerCoHost = false;
    if (req.user) {
        const organizerFound = await Membership.findAll({
            where: {
                userId: req.user.id,
                groupId: req.params.groupId,
                status: {
                    [Op.in]: ['co-host', 'organizer']
                }
            }
        });

        if (organizerFound.length !== 0) isOrganizerCoHost = true;
    }

    let members = [];
    if (isOrganizerCoHost) {
        members = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: {
                model: Membership,
                where: {
                    groupId: group.id
                },
                attributes: ['status']
            }
        });
    } else {
        members = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: {
                model: Membership,
                where: {
                    groupId: group.id,
                    status:
                    {
                        [Op.ne]: 'pending'
                    },
                },
                attributes: ['status']
            }
        });
    };

    const payload = [];
    for (let member of members) {
        const memberData = member.toJSON();
        memberData.Membership = memberData.Memberships;
        delete memberData.Memberships;
        payload.push(memberData);
    }
    return res.json({ Members: payload });
});

// 19. Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group couldn't be found" });

    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: req.params.groupId
        }
    });

    if (membership === null) {
        const member = await Membership.create({
            userId: req.user.id,
            groupId: req.params.groupId,
            status: 'pending'
        });
        return res.json({
            memberId: member.userId,
            groupId: member.groupId,
            status: 'pending'
        })
    } else if (membership.status === 'pending') {
        return res.status(400).json({
            "message": "Membership has already been requested"
        });
    } else {
        return res.status(400).json({
            "message": "User is already a member of the group"
        })
    };
});

// 20. Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group couldn't be found" });

    const { memberId, status } = req.body;

    // authorization:
    const isOrganizer = await isOrganizerFun(req.params.groupId, req.user.id);
    const isOrganizerCohost = await isOrganizerCohostFun(req.params.groupId, req.user.id);

    if (status === 'member' && !isOrganizerCohost) {
        return res.status(403).json({ message: "Forbidden" });
    };

    if (status === 'co-host' && !isOrganizer) {
        return res.status(403).json({ message: "Forbidden" });
    };

    // Error response if status changes to "pending"
    if (status === 'pending') {
        return res.status(400).json({
            "message": "Validations Error",
            "errors": {
                "status": "Cannot change a membership status to pending"
            }
        });
    };

    // might need to add validation for memberId and status
    // -- memberId is a positive integer
    // status is enum
    const errors = {};
    if (!Number.isInteger(memberId) || (Number.isInteger(memberId) && memberId <= 0)) {
        errors.memberId = "User couldn't be found";
    };
    const sta = ['pending', 'member', 'co-host', 'organizer'];
    if (!sta.includes(status)) {
        errors.status = "Membership status must be 'pending', 'member', 'co-host', or 'organizer'.";
    };

    if (Object.keys(errors).length !== 0) {
        return res.status(400).json({
            message: "Validation Error",
            errors
        });
    };

    // Error response if member cannot be found in the user table
    const targetUser = await User.findByPk(memberId);
    if (!targetUser) {
        return res.status(400).json({
            "message": "Validation Error",
            "errors": {
                "memberId": "User couldn't be found"
            }
        });
    };

    // Error response if this membership doesn't exist.
    const targetMembership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: req.params.groupId
        }
    });
    if (!targetMembership) {
        return res.status(404).json({
            "message": "Membership between the user and the group does not exist"
        });
    };

    // afterall, change the status
    targetMembership.status = status;
    await targetMembership.save();

    return res.json({
        id: targetMembership.id,
        groupId: targetMembership.groupId,
        memberId: targetMembership.userId,
        status: targetMembership.status
    });
});

// 21. Delete membership to a group specified by id
router.delete('/:groupId/membership', requireAuth, checkDeletedMember, async (req, res, next) => {
    const { memberId, status } = req.body;

    // Error response if member cannot be found in the user table
    const targetUser = await User.findByPk(memberId);
    if (!targetUser) {
        return res.status(400).json({
            "message": "Validation Error",
            "errors": {
                "memberId": "User couldn't be found"
            }
        });
    };

    // Error response if this membership doesn't exist.
    const targetMembership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: req.params.groupId
        }
    });
    if (!targetMembership) {
        return res.status(404).json({
            "message": "Membership does not exist for this user"
        });
    };

    // afterall, delete the membership
    await targetMembership.destroy();

    return res.json({
        message: "Successfully deleted membership from this group."
    });
});


// Feature 5: attendance endpoints
// Feature 6: image endpoints

module.exports = router;
