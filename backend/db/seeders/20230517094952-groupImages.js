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
    options.tableName = 'GroupImages';
    await queryInterface.bulkInsert(options, [
      {
        groupId: 3,
        url: "https://www.url1.com/",
        preview: true
      },
      {
        groupId: 2,
        url: "https://www.url2.com/",
        preview: false
      },
      {
        groupId: 2,
        url: "https://www.url3.com/",
        preview: true
      },
      {
        groupId: 1,
        url: "https://www.url4.com/",
        preview: false
      },
      {
        groupId: 1,
        url: "https://www.url5.com/",
        preview: true
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'GroupImages';
    await queryInterface.bulkDelete(options);
  }
};
