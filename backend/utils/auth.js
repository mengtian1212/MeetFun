const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

const { Op, ValidationErrorItemType } = require('sequelize');

// Sends a JWT Cookie (used in the login and signup routes)
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

// authentication0: If there is no current user, return an error
const requireAuth = async (req, _res, next) => {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
};

// authorization1: check if the current user is the organizer of the group, return an error
const isOrganizer = async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) return res.status(404).json({ message: "Group couldn't be found" });
    if (req.user.id !== group.organizerId) return res.status(403).json({ message: "Forbidden" });
    next();
};

// authorization2: check if the current user is the organizer or co-host of the group, return an error
const isOrganizerCoHost = async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) return res.status(404).json({ message: "Group couldn't be found" });

    const membership = await Membership.findAll({
        where: {
            userId: req.user.id,
            groupId: req.params.groupId,
            status: {
                [Op.in]: ['co-host', 'organizer']
            }
        }
    });

    if (membership.length === 0) return res.status(403).json({ message: "Forbidden" });
    next();
};

// authorization3: using venueId, check if the current user is the organizer or co-host of the group, return an error
const isOrganizerCoHostVenue = async (req, res, next) => {
    const venue = await Venue.findByPk(req.params.venueId);
    if (!venue) return res.status(404).json({ message: "Venue couldn't be found" });

    const group = await venue.getGroup();

    if (!group) return res.status(404).json({ message: "Group couldn't be found" });

    const membership = await Membership.findAll({
        where: {
            userId: req.user.id,
            groupId: group.id,
            status: {
                [Op.in]: ['co-host', 'organizer']
            }
        }
    });

    if (membership.length === 0) return res.status(403).json({ message: "Forbidden" });
    next();
};

// authorization4: using eventId, check if the current user is the organizer or co-host of the group, return an error
const isOrganizerCoHostEvent = async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event couldn't be found" });

    const group = await Group.findByPk(event.groupId);
    if (!group) return res.status(404).json({ message: "Group couldn't be found" });

    const membership = await Membership.findAll({
        where: {
            userId: req.user.id,
            groupId: event.groupId,
            status: {
                [Op.in]: ['co-host', 'organizer']
            }
        }
    });

    if (membership.length === 0) return res.status(403).json({ message: "Forbidden" });
    next();
};

// authorization5: using eventId, check if the current user is the attendee of the event or organizer of the group, return an error
const isAttendeeByEventId = async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);

    if (!event) return res.status(404).json({ message: "Event couldn't be found" });

    const group = await event.getGroup();

    const eventAttendance = await Attendance.findAll({
        where: {
            eventId: req.params.eventId,
            userId: req.user.id,
            status: 'attending'
        }
    });

    if (group.organizerId !== req.user.id && eventAttendance.length === 0) return res.status(403).json({ message: "Forbidden" });
    next();
};

// authorization6 function: check if the current user is the organizer of the group, return an true/false
const isOrganizerFun = async (groupIdentifier, userIdentifier) => {
    const group = await Group.findByPk(groupIdentifier);
    if (group.organizerId !== userIdentifier) return false;
    return true;
};

// authorization7 function: check if the current user is the organizer or co-host of the group, return an true/false
const isOrganizerCohostFun = async (groupIdentifier, userIdentifier) => {
    const membership = await Membership.findAll({
        where: {
            userId: userIdentifier,
            groupId: groupIdentifier,
            status: {
                [Op.in]: ['co-host', 'organizer']
            }
        }
    });

    if (membership.length === 0) return false;
    return true;
};

// authorization8: check if the current user is the organizer of the group,
// or the membership being deleted, return error
const checkDeletedMember = async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) return res.status(404).json({ message: "Group couldn't be found" });

    if (req.user.id !== req.body.memberId && req.user.id !== group.organizerId) return res.status(403).json({ message: "Forbidden" });
    next();
};

// authorization9: check if the current user is the host of the group,
// or the attendee being deleted, return error
const checkDeletedAttendee = async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event couldn't be found" });

    const membership = await Membership.findAll({
        where: {
            userId: req.user.id,
            groupId: event.groupId,
            status: {
                [Op.in]: ['co-host', 'organizer']
            }
        }
    });
    if (req.user.id !== req.body.userId && membership.length === 0) {
        return res.status(403).json({ message: "Only the User or organizer may delete an Attendance" });
    };
    next();
};

module.exports = {
    setTokenCookie, restoreUser, requireAuth,
    isOrganizer, isOrganizerCoHost, isOrganizerCoHostVenue, isOrganizerCoHostEvent, isAttendeeByEventId,
    isOrganizerFun, isOrganizerCohostFun, checkDeletedMember, checkDeletedAttendee
};
