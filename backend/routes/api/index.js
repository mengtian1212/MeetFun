const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const groupsRouter = require("./groups.js");
const venuesRouter = require("./venues.js");
const eventsRouter = require("./events.js");
const groupImagesRouter = require("./group-images.js");
const eventImagesRouter = require("./event-images.js");
const attendancesRouter = require("./attendances.js");
const membershipsRouter = require("./memberships.js");
const directChatsRouter = require("./direct-chats.js");
const eventChatsRouter = require("./event-chats.js");

const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/groups", groupsRouter);

router.use("/venues", venuesRouter);

router.use("/events", eventsRouter);

router.use("/group-images", groupImagesRouter);

router.use("/event-images", eventImagesRouter);

router.use("/attendances", attendancesRouter);

router.use("/memberships", membershipsRouter);

router.use("/direct-chats", directChatsRouter);

router.use("/event-chats", eventChatsRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});
module.exports = router;
