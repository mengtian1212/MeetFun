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
// 10. Edit a Venue specified by its id
router.put('/:venueId', requireAuth, isOrganizerCoHostVenue, validateVenue, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.findByPk(req.params.venueId);

    if (address) venue.address = address;
    if (city) venue.city = city;
    if (state) venue.state = state;
    if (lat) venue.lat = lat;
    if (lng) venue.lng = lng;
    await venue.save();

    const updatedVenue = await Venue.findByPk(req.params.venueId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    return res.json(updatedVenue);
});

// Feature 3: event endpoints
// Feature 4: membership endpoints
// Feature 5: attendance endpoints
// Feature 6: image endpoints

module.exports = router;
