const { validationResult } = require("express-validator");
const { check } = require("express-validator");
const {
  User,
  Group,
  GroupImage,
  Event,
  EventImage,
  Membership,
  Venue,
  Attendance,
} = require("../db/models");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));
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
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 30 })
    .withMessage("About must be 30 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private")
    // .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("Private must be a boolean"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("state")
    .isAlpha()
    .isLength({ min: 2, max: 2 })
    .withMessage("State must be 2 characters"),
  handleValidationErrors,
];

const validateVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isDecimal({ force_decimal: true })
    .withMessage("Latitude is not valid"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isDecimal({ force_decimal: true })
    .withMessage("Longitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  handleValidationErrors,
];

const validateEvent = async (req, res, next) => {
  const {
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate,
  } = req.body;
  const errors = {};

  // venueId
  if (venueId && !Number.isInteger(venueId)) {
    errors.venueId = "Venue does not exist";
  } else if (venueId !== null && Number.isInteger(venueId) && venueId <= 0) {
    errors.venueId = "Venue does not exist";
  } else if (venueId !== null && Number.isInteger(venueId) && venueId > 0) {
    const venue = await Venue.findByPk(venueId);
    if (!venue) errors.venueId = "Venue does not exist";
  }

  if (venueId === undefined) errors.venueId = "Venue does not exist";

  //name
  if (!name || typeof name !== "string" || name.length < 5)
    errors.name = "Name must be at least 5 characters";
  //description
  if (!description) errors.description = "Description is required";
  // type
  const types = ["Online", "In person"];
  if (!type || !types.includes(type))
    errors.type = "Type must be 'Online' or 'In person'";
  // capacity
  if (
    !capacity ||
    !Number.isInteger(capacity) ||
    (Number.isInteger(capacity) && capacity < 0)
  )
    errors.capacity = "Capacity must be an integer";
  //price
  if (
    !price ||
    typeof price !== "number" ||
    (typeof price === "number" && price < 0)
  )
    errors.price = "Price is invalid";

  // startDate
  if (
    !startDate ||
    typeof startDate !== "string" ||
    isNaN(Date.parse(startDate))
  ) {
    errors.startDate = "Start date must be in the future";
  } else {
    const currDateTime = new Date().getTime();
    const startDateTime = new Date(startDate).getTime();
    if (startDateTime <= currDateTime) {
      errors.startDate = "Start date must be in the future";
    }
  }

  // endDate
  if (!endDate || typeof endDate !== "string" || isNaN(Date.parse(endDate))) {
    errors.endDate = "End date is less than start date";
  } else {
    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();
    if (endDateTime < startDateTime) {
      errors.endDate = "End date is less than start date";
    }
  }

  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  } else {
    next();
  }
};

const validateImage = [
  check("url")
    .exists({ checkFalsy: true })
    .withMessage("Please input an image url"),
  check("preview")
    // .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("Preview must be a boolean"),
  handleValidationErrors,
];

const isVenueExist = async (req, res, next) => {
  const { venueId } = req.body;

  if (Number.isInteger(venueId) && venueId > 0) {
    const venue = await Venue.findByPk(venueId);
    if (!venue)
      return res.status(404).json({ message: "Venue couldn't be found" });
  }
  next();
};

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

const queryValidationCheck = async (req, res, next) => {
  let { page, size, name, type, startDate } = req.query;
  const typeofName = typeof name;
  const typeofType = typeof type;
  console.log("-------------------------");
  console.log("req.query print:", req.query);
  console.log(
    "page print",
    page,
    "size:",
    size,
    "name:",
    name,
    "type:",
    type,
    "startDate:",
    startDate,
    "typeof name:",
    typeofName,
    "typeof type:",
    typeofType
  );
  console.log("-------------------------");

  const errors = {};
  if (page) {
    pageParsed = parseInt(page);
    if (
      isNaN(page) ||
      !Number.isInteger(pageParsed) ||
      (Number.isInteger(pageParsed) && pageParsed < 1) ||
      (Number.isInteger(pageParsed) && pageParsed > 10)
    ) {
      errors.page = "Page must be between 1 and 10";
    }
  }

  if (size) {
    sizeParsed = parseInt(size);
    if (
      isNaN(size) ||
      !Number.isInteger(sizeParsed) ||
      (Number.isInteger(sizeParsed) && sizeParsed < 1) ||
      (Number.isInteger(sizeParsed) && sizeParsed > 20)
    ) {
      errors.size = "Size must be betwee 1 and 20";
    }
  }

  if (name) {
    if (!isNaN(name) || typeof name !== "string") {
      errors.name = "Name must be a string";
    }
  }

  if (type) {
    if (!Array.isArray(type) && typeof type !== "string") {
      errors.type = "Type must be 'Online' or 'In Person'";
    }

    if (typeof type === "string") {
      // const typeDecoded = decodeURI(type);
      if (!["Online", "In person"].includes(type)) {
        errors.type = "Type must be 'Online' or 'In Person'";
      }
    }

    if (Array.isArray(type)) {
      for (let eachType of type) {
        // const typeDecoded = decodeURI(eachType);
        if (!["Online", "In person"].includes(eachType)) {
          errors.type = "Type must be 'Online' or 'In Person'";
          break;
        }
      }
    }
  }

  if (startDate) {
    if (typeof startDate !== "string")
      errors.startDate = "Start date must be a valid datetime";
    // if (new Date(startDate).toString() === 'Invalid Date') errors.startDate = "Start date must be a valid datetime";
    if (isNaN(new Date(startDate).getTime()))
      errors.startDate = "Start date must be a valid datetime";
  }

  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }
  next();
};
module.exports = {
  handleValidationErrors,
  validateGroup,
  validateVenue,
  validateEvent,
  validateImage,
  isVenueExist,
  queryValidationCheck,
};
