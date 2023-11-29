"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const chats = [
  { eventId: 1 },
  { eventId: 2 },
  { eventId: 3 },
  { eventId: 4 },
  { eventId: 5 },
  { eventId: 6 },
  { eventId: 7 },
  { eventId: 8 },
  { eventId: 9 },
  { eventId: 10 },
  { eventId: 11 },
  { eventId: 12 },
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
    options.tableName = "EventChats";
    await queryInterface.bulkInsert(options, chats, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "EventChats";
    await queryInterface.bulkDelete(options);
  },
};
