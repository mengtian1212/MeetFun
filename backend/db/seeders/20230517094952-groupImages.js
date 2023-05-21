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
        groupId: 1,
        url: "https://fakeimageurl.com/image1.jpg",
        preview: true
      },
      {
        groupId: 1,
        url: "https://fakeimageurl.com/image2.jpg",
        preview: false
      },
      {
        groupId: 2,
        url: "https://fakeimageurl.com/image3.jpg",
        preview: false
      },
      {
        groupId: 2,
        url: "https://fakeimageurl.com/image4.jpg",
        preview: true
      },
      {
        groupId: 3,
        url: "https://fakeimageurl.com/image5.jpg",
        preview: false
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
