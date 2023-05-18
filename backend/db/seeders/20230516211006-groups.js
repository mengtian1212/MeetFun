'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const { User, Group } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
    *
    * Example:
    * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // method 1: using bulkInsert
    const groups = [
      {
        name: "FakeGroup1",
        about: "Perfect opportunity to connect with music lovers online.",
        type: "Online",
        private: false,
        city: "New York City",
        state: "NY",
        organizerId: 1
      },
      {
        name: "FakeGroup2",
        about: "Join our investors group to learn all areas of investment opportunities.",
        type: "In person",
        private: true,
        city: "Chicago",
        state: "IL",
        organizerId: 4
      },
      {
        name: "FakeGroup3",
        about: "Let's get together and enjoy the fun to tackle Kaggle challenges.",
        type: "Online",
        private: false,
        city: "San Jose",
        state: "CA",
        organizerId: 2
      }
    ];
    options.tableName = 'Groups';
    await queryInterface.bulkInsert(options, groups, {});

    // method2: dynamic seeding
    // const groups = [
    //   {
    //     name: "FakeGroup1",
    //     about: "Perfect opporunity to connect with music lovers online.",
    //     type: "Online",
    //     private: false,
    //     city: "New York City",
    //     state: "NY",
    //     organizer: "Demo-lition"
    //   },
    //   {
    //     name: "FakeGroup2",
    //     about: "Join our investors group to learn all areas of investment opportunities.",
    //     type: "In person",
    //     private: true,
    //     city: "Chicago",
    //     state: "IL",
    //     organizer: "FakeUser3"
    //   },
    //   {
    //     name: "FakeGroup3",
    //     about: "Let's get together and enjoy the fun to tackle Kaggle challenges.",
    //     type: "Online",
    //     private: false,
    //     city: "San Jose",
    //     state: "CA",
    //     organizer: "FakeUser1"
    //   }
    // ];

    // try {
    //   for (let group of groups) {
    //     const foundOrganizer = await User.findOne({
    //       where: { username: group.organizer }
    //     });
    //     await Group.create({
    //       organizerId: foundOrganizer.id,
    //       name: group.name,
    //       about: group.about,
    //       type: group.type,
    //       private: group.private,
    //       city: group.city,
    //       state: group.state,
    //     });
    //   };
    // } catch (err) {
    //   console.error(err);
    //   throw err;
    // };
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups';
    // const Op = Sequelize.Op;
    // await queryInterface.bulkDelete(options, {
    //   name: { [Op.in]: ['FakeGroup1', 'FakeGroup2', 'FakeGroup3'] }
    // }, {});
    await queryInterface.bulkDelete(options);
  }
};
