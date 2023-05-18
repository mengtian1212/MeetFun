'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const venues = [
  {
    groupId: 1,
    address: "321 Main Avenue",
    city: "Brooklyn",
    state: "NY",
    lat: 40.650002,
    lng: -73.949997
  },
  {
    groupId: 2,
    address: "111 Fox Drive",
    city: "Pittsburgh",
    state: "PA",
    lat: 40.440624,
    lng: -79.995888
  },
  {
    groupId: 2,
    address: "222 River Drive",
    city: "San Francisco",
    state: "CA",
    lat: 37.773972,
    lng: -122.431297
  },
  {
    groupId: 3,
    address: "1001 NE Snow Way",
    city: "Anchorage",
    state: "AK",
    lat: 61.217381,
    lng: -149.863129
  }
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
    options.tableName = 'Venues';
    await queryInterface.bulkInsert(options, venues, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Venues';
    await queryInterface.bulkDelete(options);
  }
};
