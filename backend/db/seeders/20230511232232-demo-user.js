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
          picture: "https://randomuser.me/api/portraits/women/90.jpg",
        },
        {
          firstName: "Sarah",
          lastName: "Johnson",
          email: "user2@gmail.com",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password2"),
          picture: "https://randomuser.me/api/portraits/women/56.jpg",
        },
        {
          firstName: "Michael",
          lastName: "Williams",
          email: "user3@gmail.com",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password3"),
          picture: "https://randomuser.me/api/portraits/men/51.jpg",
        },
        {
          firstName: "Emily",
          lastName: "Brown",
          email: "user4@gmail.com",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password4"),
          picture: "https://randomuser.me/api/portraits/women/54.jpg",
        },
        {
          firstName: "David",
          lastName: "Talyor",
          email: "user5@gmail.com",
          username: "FakeUser5",
          hashedPassword: bcrypt.hashSync("password5"),
          picture: "https://randomuser.me/api/portraits/men/54.jpg",
        },
        {
          firstName: "Cynthia",
          lastName: "Michelle",
          email: "user6@gmail.com",
          username: "FakeUser6",
          hashedPassword: bcrypt.hashSync("password6"),
          picture: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
          firstName: "John",
          lastName: "Russo",
          email: "user7@gmail.com",
          username: "FakeUser7",
          hashedPassword: bcrypt.hashSync("password7"),
          picture: "https://randomuser.me/api/portraits/men/7.jpg",
        },
        {
          firstName: "Daniel",
          lastName: "Grinell",
          email: "user8@gmail.com",
          username: "FakeUser8",
          hashedPassword: bcrypt.hashSync("password8"),
          picture: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          firstName: "Scott",
          lastName: "Kingsley",
          email: "user9@gmail.com",
          username: "FakeUser9",
          hashedPassword: bcrypt.hashSync("password9"),
          picture: "https://randomuser.me/api/portraits/men/94.jpg",
        },
        {
          firstName: "Jeremy",
          lastName: "Felix",
          email: "user10@gmail.com",
          username: "FakeUser10",
          hashedPassword: bcrypt.hashSync("password10"),
          picture: "https://randomuser.me/api/portraits/men/26.jpg",
        },
        {
          firstName: "Kumar",
          lastName: "Patel",
          email: "user11@gmail.com",
          username: "FakeUser11",
          hashedPassword: bcrypt.hashSync("password11"),
          picture: "https://randomuser.me/api/portraits/men/39.jpg",
        },
        {
          firstName: "Austin",
          lastName: "Ali",
          email: "user12@gmail.com",
          username: "FakeUser12",
          hashedPassword: bcrypt.hashSync("password12"),
          picture: "https://randomuser.me/api/portraits/men/85.jpg",
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
    // const Op = Sequelize.Op;
    // await queryInterface.bulkDelete(
    //   options,
    //   {
    //     username: {
    //       [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2", "FakeUser3"],
    //     },
    //   },
    //   {}
    // );
    await queryInterface.bulkDelete(options);
  },
};
