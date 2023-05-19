'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const events = [
  {
    venueId: 4,
    groupId: 1,
    name: "Electronic Music Meet and Greet",
    type: "In person",
    capacity: 30,
    price: 5,
    description: "Join us for one hour of laid back song sharing and social time.",
    // startDate: new Date('1 Oct 2023 10:00:00 EST'),
    // endDate: new Date('1 Oct 2023 11:00:00 EST')
    startDate: "2023-10-01 10:00:00",
    endDate: "2023-10-01 11:00:00"
  },
  {
    venueId: 1,
    groupId: 1,
    name: "Gather and play piano music in May",
    type: "In person",
    capacity: 58,
    price: 0,
    description: "Come and join us at Story Music Bar for our monthly in-person meeting to play and listen to their wonderful collection of Steinway pianos. ",
    // startDate: new Date('31 May 2023 14:00:00 EST'),
    // endDate: new Date('31 May 2023 16:00:00 EST')
    startDate: "2023-06-30 14:00:00",
    endDate: "2023-06-30 16:00:00"
  }, {
    venueId: 3,
    groupId: 2,
    name: "The Basics of Options Trading Workshop",
    type: "Online",
    capacity: 200,
    price: 90.85,
    description: "Come join us for this great introduction to the basics of options.",
    // startDate: new Date('20 AUG 2023 8:00:00 EST'),
    // endDate: new Date('20 AUG 2023 9:00:00 EST')
    startDate: "2023-09-20 8:00:00",
    endDate: "2023-09-20 9:00:00"
  },
  {
    venueId: 2,
    groupId: 2,
    name: "Real Estate Investing Sharing & Networking Event",
    type: "Online",
    capacity: 123,
    price: 62.16,
    description: "Register to expand your real estate investing career.",
    // startDate: new Date('20 JUL 2023 20:00:00 EST'),
    // endDate: new Date('21 JUL 2023 21:30:00 EST')
    startDate: "2024-07-14 20:00:00",
    endDate: "2024-07-14 21:30:00"
  },
  {
    venueId: 4,
    groupId: 3,
    name: "Hands On Machine Learning",
    type: "Online",
    capacity: 200,
    price: 12.5,
    description: "A casual event to attend a ML lightening talk presented by a member and to meet other programmers!",
    // startDate: new Date('12 Dec 2023 17:15:00 EST'),
    // endDate: new Date('13 Dec 2023 17:15:00 EST')
    startDate: "2025-12-12 17:15:00",
    endDate: "2025-12-13 17:15:00"
  }
];

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
    options.tableName = 'Events';
    await queryInterface.bulkInsert(options, events, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Events';
    await queryInterface.bulkDelete(options);
  }
};
