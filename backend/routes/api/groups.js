const express = require('express');
const { Op } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Group, GroupImage, Event, EventImage, Membership, Venue, Attendance, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Middlewares:

// Route handlers:
// 1. Get all groups:
router.get('/', async (req, res, next) => {
    const groups = await Group.findAll();

    const result = [];

    for (let group of groups) {
        groupData = group.toJSON();

        // get aggregate: numMembers
        const numMembers = await Membership.count({
            where: {
                groupId: group.id,
                status: {
                    [Op.in]: ['member', 'co-host']
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
            groupData.previewImage = `No preview Image for this group`;
        }

        result.push(groupData);
    };

    return res.json({ Groups: result });
});

// 2. Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const groupsOrganized = await Group.findAll({
        where: {
            organizerId: req.user.id
        },
        include: {
            model: GroupImage,
            where: {
                preview: true
            },
            attributes: ["url"]
        }
    });

    const groupsJoined = await Group.findAll({
        include: [
            {
                model: Membership,
                where: {
                    userId: req.user.id,
                    status: {
                        [Op.in]: ['member', 'co-host']
                    },
                },
                attributes: []
            },
            {
                model: GroupImage,
                where: {
                    preview: true
                },
                attributes: ["url"]
            }
        ],
    });

    const result = [];
    const resultGroupId = [];
    for (let group of groupsOrganized) {
        const groupData = group.toJSON();
        result.push(groupData);
        resultGroupId.push(groupData.id);
    }

    for (let group of groupsJoined) {
        if (!resultGroupId.includes(group.id)) {
            const groupData = group.toJSON();
            result.push(groupData);
        }
    }

    for (let groupData of result) {
        groupData.createdAt = groupData.createdAt.toISOString().slice(0, 10) + ' ' + groupData.createdAt.toISOString().slice(11, 19);
        groupData.updatedAt = groupData.updatedAt.toISOString().slice(0, 10) + ' ' + groupData.updatedAt.toISOString().slice(11, 19);

        groupData.numMembers = await Membership.count({
            where: {
                groupId: groupData.id,
                status: {
                    [Op.in]: ['member', 'co-host']
                }
            }
        });

        if (groupData.GroupImages[0].url) {
            groupData.previewImage = groupData.GroupImages[0].url;
        }
        else {
            groupData.previewImage = `No preview Image for this group`;
        }
        delete groupData.GroupImages;
    }
    return res.json({ Groups: result });
});

// 3. Get details of a Group from an id
router.get('/:groupId', async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview'],
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

    if (!group) {
        const err = new Error("Group couldn't be found");
        return res.status(404).json({
            message: err.message
        });
    } else {
        const result = group.toJSON();
        result.createdAt = group.createdAt.toISOString().slice(0, 10) + ' ' + group.createdAt.toISOString().slice(11, 19);
        result.updatedAt = group.updatedAt.toISOString().slice(0, 10) + ' ' + group.updatedAt.toISOString().slice(11, 19);
        return res.json(result);
    }
});

module.exports = router;
