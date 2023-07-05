"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

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
    options.tableName = "Attendances";
    await queryInterface.bulkInsert(
      options,
      [
        {
          /* group 1 event*/ eventId: 1,
          userId: 1,
          status: "attending",
        },
        {
          /* group 1 event*/ eventId: 2,
          userId: 1,
          status: "attending",
        },
        {
          /* group 2 event*/ eventId: 4,
          userId: 1,
          status: "waitlist",
        },
        {
          /* group 2 event*/ eventId: 3,
          userId: 2,
          status: "attending",
        },
        {
          /* group 2 event*/ eventId: 4,
          userId: 2,
          status: "waitlist",
        },
        {
          /* group 1 event*/ eventId: 2,
          userId: 3,
          status: "waitlist",
        },
        {
          /* group 2 event*/ eventId: 3,
          userId: 3,
          status: "pending",
        },
        {
          /* group 3 event*/ eventId: 5,
          userId: 3,
          status: "attending",
        },
        {
          /* group 1 event*/ eventId: 1,
          userId: 4,
          status: "pending",
        },
        {
          /* group 2 event*/ eventId: 4,
          userId: 4,
          status: "pending",
        },
        {
          /* group 3 event*/ eventId: 5,
          userId: 4,
          status: "attending",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Attendances";
    await queryInterface.bulkDelete(options);
  },
};
