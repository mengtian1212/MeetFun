const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

const { Op } = require('sequelize');

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

// authentication: If there is no current user, return an error
const requireAuth = function (req, _res, next) {
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

module.exports = { setTokenCookie, restoreUser, requireAuth, isOrganizer, isOrganizerCoHost };
