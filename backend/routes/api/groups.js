const express = require('express');
const { Op } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Middlewares:

// Route handlers:
router.get('/', async (req, res, next) => {
    const groups = await Group.findAll();
    return res.json(groups);
});

module.exports = router;
