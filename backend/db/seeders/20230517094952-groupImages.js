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
    options.tableName = "GroupImages";
    await queryInterface.bulkInsert(
      options,
      [
        {
          groupId: 1,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: true,
        },
        {
          groupId: 1,
          url: "https://fakeimageurl.com/image2.jpg",
          preview: false,
        },
        {
          groupId: 2,
          url: "https://fakeimageurl.com/image3.jpg",
          preview: false,
        },
        {
          groupId: 2,
          url: "https://as1.ftcdn.net/v2/jpg/02/85/75/96/1000_F_285759676_yOhBu1PWhSkWsmEeCQ2R8dzLjLlAciIQ.jpg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://as2.ftcdn.net/v2/jpg/02/30/44/19/1000_F_230441943_oV0LSRsvbMPOhQioB7zgNs1uDs27BaOp.jpg",
          preview: true,
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
    options.tableName = "GroupImages";
    await queryInterface.bulkDelete(options);
  },
};
