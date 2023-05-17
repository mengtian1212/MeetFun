'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

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
    options.tableName = 'EventImages';
    await queryInterface.bulkInsert(options, [
      {
        eventId: 3,
        url: "https://www.example.com/images/fake-image-1.jpg",
        preview: true
      },
      {
        eventId: 5,
        url: "https://www.example.com/images/fake-image-2.jpg",
        preview: false
      },
      {
        eventId: 1,
        url: "https://www.example.com/images/fake-image-3.jpg",
        preview: true
      },
      {
        eventId: 4,
        url: "https://www.example.com/images/fake-image-4.jpg",
        preview: false
      },
      {
        eventId: 4,
        url: "https://www.example.com/images/fake-image-5.jpg",
        preview: true
      },
      {
        eventId: 4,
        url: "https://www.example.com/images/fake-image-6.jpg",
        preview: false
      },
      {
        eventId: 2,
        url: "https://www.example.com/images/fake-image-7.jpg",
        preview: true
      },
      {
        eventId: 3,
        url: "https://www.example.com/images/fake-image-8.jpg",
        preview: false
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'EventImages';
    await queryInterface.bulkDelete(options);
  }
};
