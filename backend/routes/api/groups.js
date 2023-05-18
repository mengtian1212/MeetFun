const express = require('express');
const { Op } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, Membership, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Middlewares:

// Route handlers:

// Get all groups:
router.get('/', async (req, res, next) => {
    const groups = await Group.findAll();

    const result = [];

    for (let group of groups) {
        groupData = group.toJSON();

        // get aggregate: numMembers
        const numMembers = await Membership.count({
            where: {
                groupId: group.id,
                status: 'member'
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
            groupData.previewImage = `No preview Image for this group`;
        }

        result.push(groupData);
    };

    return res.json({ Groups: result });
});

module.exports = router;
