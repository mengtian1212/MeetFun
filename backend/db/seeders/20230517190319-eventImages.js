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
    options.tableName = "EventImages";
    await queryInterface.bulkInsert(
      options,
      [
        {
          eventId: 1,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: false,
        },
        {
          eventId: 4,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: false,
        },
        {
          eventId: 4,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: true,
        },
        {
          eventId: 4,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: false,
        },
        {
          eventId: 5,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: false,
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
    options.tableName = "EventImages";
    await queryInterface.bulkDelete(options);
  },
};
