const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance } = require('../db/models');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);
        // .forEach(error => errors[error.param] = error.msg);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next();
};

const validateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 1, max: 60 })
        .withMessage("Name must be 60 characters or less"),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage("About must be 50 characters or more"),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        // .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage("Private must be a boolean"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    handleValidationErrors
];

const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal({ force_decimal: true })
        .withMessage("Latitude is not valid"),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal({ force_decimal: true })
        .withMessage("Longitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    handleValidationErrors
];

const validateEvent = async (req, res, next) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const types = ['Online', 'In person'];
    const currDateTime = new Date().getTime();
    let startDateTime;
    let endDateTime;
    if (startDate) {
        startDateTime = new Date(startDate).getTime();
    };
    if (endDate) {
        endDateTime = new Date(endDate).getTime();
    };

    const errors = {};
    if (venueId) {
        const venue = await Venue.findByPk(venueId);
        if (!venue) errors.venueId = "Venue does not exist";
    }

    if (!name || name.length < 5) errors.name = "Name must be at least 5 characters";
    if (!description) errors.description = "Description is required";
    if (!type || !types.includes(type)) errors.type = "Type must be 'Online' or 'In person'";
    if (!capacity || !Number.isInteger(capacity) || (Number.isInteger(capacity) && capacity < 0)) errors.capacity = "Capacity must be an integer";
    if (!price || typeof (price) !== 'number' || (typeof (price) === 'number' && price < 0)) errors.price = "Price is invalid";
    if (!startDate || (startDate && startDateTime <= currDateTime)) errors.startDate = "Start date must be in the future";
    if (!endDate || (endDateTime && endDateTime < startDateTime)) errors.endDate = "End date is less than start date";

    if (Object.keys(errors).length !== 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    } else {
        next();
    }
};

const validateImage = [
    check('url')
        .exists({ checkFalsy: true })
        .withMessage("Please input an image url"),
    check('preview')
        // .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage("Preview must be a boolean"),
    handleValidationErrors
];

// const validateEvent = [
//     check('venueId')
//         .exists({ checkFalsy: true })
//         .withMessage("Venue does not exist"),
//     check('name')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 5 })
//         .withMessage("Name must be at least 5 characters"),
//     check('description')
//         .exists({ checkFalsy: true })
//         .withMessage("Description is required"),
//     check('type')
//         .exists({ checkFalsy: true })
//         .isIn(['Online', 'In person'])
//         .withMessage("Type must be 'Online' or 'In person'"),
//     check('capacity')
//         .exists({ checkFalsy: true })
//         .isInt()
//         .withMessage("Capacity must be an integer"),
//     check('price')
//         .exists({ checkFalsy: true })
//         .isFloat({ min: 0 })
//         .withMessage("Price is invalid"),
//     check('startDate')
//         .exists({ checkFalsy: true })
//         .isAfter({ comparisonDate: new Date() })
//         .withMessage("Start date must be in the future"),
//     check('endDate')
//         .exists({ checkFalsy: true })
//         .isAfter({ comparisonDate: 'startDate' })
//         .withMessage("End date is less than start date"),
//     handleValidationErrors
// ];

module.exports = {
    handleValidationErrors, validateGroup, validateVenue, validateEvent, validateImage
};
