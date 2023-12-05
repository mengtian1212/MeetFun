"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const chats = [
  {
    user1Id: 1,
    user2Id: 2,
  },
  {
    user1Id: 1,
    user2Id: 3,
  },
  {
    user1Id: 1,
    user2Id: 5,
  },
  {
    user1Id: 5,
    user2Id: 6,
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
    options.tableName = "DirectChats";
    await queryInterface.bulkInsert(options, chats, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "DirectChats";
    await queryInterface.bulkDelete(options);
  },
};
