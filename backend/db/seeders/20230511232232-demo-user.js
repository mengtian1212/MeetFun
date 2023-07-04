"use strict";

const bcrypt = require("bcryptjs");

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
    options.tableName = "Users";
    await queryInterface.bulkInsert(
      options,
      [
        {
          firstName: "Demo",
          lastName: "Lition",
          email: "user1@gmail.com",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password1"),
        },
        {
          firstName: "DemoTwo",
          lastName: "Smith",
          email: "user2@gmail.com",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "DemoThree",
          lastName: "Johnson",
          email: "user3@gmail.com",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "DemoFour",
          lastName: "Green",
          email: "user4@gmail.com",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password4"),
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
    options.tableName = "Users";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2", "FakeUser3"],
        },
      },
      {}
    );
  },
};
