"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const venues = [
  {
    /* venue 1 */ groupId: 1,
    address: "321 Main Avenue",
    city: "Brooklyn",
    state: "NY",
    lat: 40.650002,
    lng: -73.949997,
  },
  {
    /* venue 2 */ groupId: 2,
    address: "111 Fox Drive",
    city: "Pittsburgh",
    state: "PA",
    lat: 40.440624,
    lng: -79.995888,
  },
  {
    /* venue 3 */ groupId: 2,
    address: "222 River Drive",
    city: "San Francisco",
    state: "CA",
    lat: 37.773972,
    lng: -122.431297,
  },
  {
    /* venue 4 */ groupId: 3,
    address: "1001 NE Snow Way",
    city: "Houston",
    state: "TX",
    lat: 29.7604,
    lng: -95.3698,
  },
  {
    /* venue 5 */ groupId: 4,
    address: "123 Elm Street",
    city: "Bellevue",
    state: "WA",
    lat: 47.6101,
    lng: -122.2015,
  },
  {
    /* venue 6 */ groupId: 5,
    address: "456 Maple Avenue",
    city: "Los Angeles",
    state: "CA",
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    /* venue 7 */ groupId: 1,
    address: "Central Park West",
    city: "Manhattan",
    state: "NY",
    lat: 40.7831,
    lng: -73.9712,
  },
  {
    /* venue 8 */ groupId: 6,
    address: "Nile Landing Campground",
    city: "Naches",
    state: "WA",
    lat: 47.6097,
    lng: -122.3331,
  },
  {
    /* venue 9 */ groupId: 4,
    address: "Cleveland Cascade & Lakeshore Avenue",
    city: "Oakland",
    state: "CA",
    lat: 37.8044,
    lng: -122.2711,
  },
  {
    /* venue 10 */ groupId: 4,
    address: "19848 Veronica Ave",
    city: "Saratoga",
    state: "CA",
    lat: 37.28178,
    lng: -122.03561,
  },
  {
    /* venue 11 */ groupId: 4,
    address: "7 E 36th St",
    city: "New York",
    state: "NY",
    lat: 40.7497,
    lng: -73.9825,
  },
  {
    /* venue 12 */ groupId: 4,
    address: "287 Vanness Street",
    city: "Kirkland",
    state: "WA",
    lat: 47.6815,
    lng: -122.2087,
  },
  {
    /* venue 13 */ groupId: 1,
    address: "30 Newport Way",
    city: "Jersey City",
    state: "NJ",
    lat: 40.0583,
    lng: -74.4057,
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
    options.tableName = "Venues";
    await queryInterface.bulkInsert(options, venues, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Venues";
    await queryInterface.bulkDelete(options);
  },
};
