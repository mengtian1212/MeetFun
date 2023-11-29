"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const messages = [
  {
    eventChatId: 1,
    senderId: 1,
    content: "Hello there, event chat!",
    wasEdited: false,
    createdAt: new Date("11 NOV 2023 10:00:00 EST"),
    updatedAt: new Date("11 NOV 2023 10:00:00 EST"),
  },
  {
    eventChatId: 1,
    senderId: 2,
    content: "Hello there, event chat3333!",
    wasEdited: false,
    createdAt: new Date("11 NOV 2023 10:00:00 EST"),
    updatedAt: new Date("11 NOV 2023 10:00:00 EST"),
  },
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
    options.tableName = "EventMessages";
    await queryInterface.bulkInsert(options, messages, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "EventMessages";
    await queryInterface.bulkDelete(options);
  },
};
