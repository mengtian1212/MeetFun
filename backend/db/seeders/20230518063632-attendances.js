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
          //Electronic Music Meet and Greet (event organizer 1)
          /* group 1 event*/ eventId: 1,
          userId: 1,
          status: "organizer",
        },
        {
          //Electronic Music Meet and Greet (event organizer 1)
          /* group 1 event*/ eventId: 1,
          userId: 2,
          status: "attending",
        },
        {
          //Electronic Music Meet and Greet (event organizer 1)
          /* group 1 event*/ eventId: 1,
          userId: 3,
          status: "attending",
        },
        {
          //Electronic Music Meet and Greet (event organizer 1)
          /* group 1 event*/ eventId: 1,
          userId: 4,
          status: "pending",
        },
        {
          //Electronic Music Meet and Greet (event organizer 1)
          /* group 1 event*/ eventId: 1,
          userId: 5,
          status: "pending",
        },
        {
          //Gather and Play Piano Music in Winter (event organizer 1)
          /* group 1 event*/ eventId: 2,
          userId: 1,
          status: "organizer",
        },
        {
          //Gather and Play Piano Music in Winter (event organizer 1)
          /* group 1 event*/ eventId: 2,
          userId: 2,
          status: "pending",
        },
        {
          //Gather and Play Piano Music in Winter (event organizer 1)
          /* group 1 event*/ eventId: 2,
          userId: 3,
          status: "attending",
        },
        {
          //Gather and Play Piano Music in Winter (event organizer 1)
          /* group 1 event*/ eventId: 2,
          userId: 5,
          status: "attending",
        },
        {
          //Options Mastery (event organizer 2)
          /* group 2 event*/ eventId: 3,
          userId: 1,
          status: "pending",
        },
        {
          //Options Mastery (event organizer 2)
          /* group 2 event*/ eventId: 3,
          userId: 2,
          status: "organizer",
        },
        {
          //Options Mastery (event organizer 2)
          /* group 2 event*/ eventId: 3,
          userId: 4,
          status: "attending",
        },
        {
          //Real Estate Investing (event organizer 2)
          /* group 2 event*/ eventId: 4,
          userId: 1,
          status: "attending",
        },
        {
          //Real Estate Investing (event organizer 2)
          /* group 2 event*/ eventId: 4,
          userId: 2,
          status: "organizer",
        },
        {
          //Real Estate Investing (event organizer 2)
          /* group 2 event*/ eventId: 4,
          userId: 4,
          status: "attending",
        },
        {
          //Hands On Machine Learning (event organizer 3)
          /* group 3 event*/ eventId: 5,
          userId: 3,
          status: "organizer",
        },
        {
          //Hands On Machine Learning (event organizer 3)
          /* group 3 event*/ eventId: 5,
          userId: 4,
          status: "attending",
        },
        {
          //Ice Cream Cooking Class (event organizer 5)
          /* group 4 event*/ eventId: 6,
          userId: 5,
          status: "organizer",
        },
        {
          //Ice Cream Cooking Class (event organizer 5)
          /* group 4 event*/ eventId: 6,
          userId: 2,
          status: "attending",
        },
        {
          //Acoustic Jam in Central Park! (event organizer 1)
          /* group 1 event*/ eventId: 7,
          userId: 1,
          status: "organizer",
        },
        {
          //Acoustic Jam in Central Park! (event organizer 1)
          /* group 1 event*/ eventId: 7,
          userId: 3,
          status: "attending",
        },
        {
          //Acoustic Jam in Central Park! (event organizer 1)
          /* group 1 event*/ eventId: 7,
          userId: 5,
          status: "attending",
        },
        {
          //River Camping, Fishing & Hiking (event organizer 5)
          /* group 6 event*/ eventId: 8,
          userId: 5,
          status: "organizer",
        },
        {
          //River Camping, Fishing & Hiking (event organizer 5)
          /* group 6 event*/ eventId: 8,
          userId: 1,
          status: "attending",
        },
        {
          //River Camping, Fishing & Hiking (event organizer 5)
          /* group 6 event*/ eventId: 8,
          userId: 3,
          status: "attending",
        },
        {
          //Cupcake Exchange (event organizer 1)
          /* group 4 event*/ eventId: 9,
          userId: 1,
          status: "organizer",
        },
        {
          //Cupcake Exchange (event organizer 1)
          /* group 4 event*/ eventId: 9,
          userId: 2,
          status: "attending",
        },
        {
          //Cupcake Exchange (event organizer 1)
          /* group 4 event*/ eventId: 9,
          userId: 3,
          status: "pending",
        },
        {
          //Let's Eat - Free Cooking Class (event organizer 1)
          /* group 4 event*/ eventId: 10,
          userId: 1,
          status: "organizer",
        },
        {
          //Let's Eat - Free Cooking Class (event organizer 1)
          /* group 4 event*/ eventId: 10,
          userId: 2,
          status: "attending",
        },
        {
          //Let's Eat - Free Cooking Class (event organizer 1)
          /* group 4 event*/ eventId: 10,
          userId: 3,
          status: "attending",
        },
        {
          //Let's Eat - Free Cooking Class (event organizer 1)
          /* group 4 event*/ eventId: 10,
          userId: 4,
          status: "attending",
        },
        {
          //Let's Eat - Free Cooking Class (event organizer 1)
          /* group 4 event*/ eventId: 10,
          userId: 5,
          status: "attending",
        },
        {
          //Wine Tasting Social in NYC (event organizer 5)
          /* group 4 event*/ eventId: 11,
          userId: 5,
          status: "organizer",
        },
        {
          //Potluck & Board Games (event organizer 5)
          /* group 4 event*/ eventId: 12,
          userId: 5,
          status: "organizer",
        },
        {
          //Potluck & Board Games (event organizer 5)
          /* group 4 event*/ eventId: 12,
          userId: 3,
          status: "attending",
        },
        {
          //Potluck & Board Games (event organizer 5)
          /* group 4 event*/ eventId: 12,
          userId: 1,
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
