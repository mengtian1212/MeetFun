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
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg",
          preview: true,
        },
        {
          groupId: 1,
          url: "https://img.freepik.com/premium-vector/set-percussion-family-musical-instruments-vector-design-set-flat-style-percussion-music-clipart_695709-16.jpg",
          preview: false,
        },
        {
          groupId: 1,
          url: "https://img.freepik.com/free-photo/african-rastafarian-singer-male-wearing-blue-shirt-beanie-emotionally-writing-song-recording-studio-isolated-blue-background_613910-13750.jpg",
          preview: false,
        },
        {
          groupId: 2,
          url: "https://img.freepik.com/free-photo/wall-street-sign-new-york-with-new-york-stock-exchange-background_268835-669.jpg",
          preview: false,
        },
        {
          groupId: 2,
          url: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*hkkmzOHk9nUrY_oa9pCdGA.jpeg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://as2.ftcdn.net/v2/jpg/02/30/44/19/1000_F_230441943_oV0LSRsvbMPOhQioB7zgNs1uDs27BaOp.jpg",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://img.freepik.com/premium-photo/fresh-healthy-vegetables-falling-pan_738298-1829.jpg",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://as2.ftcdn.net/v2/jpg/01/91/05/77/1000_F_191057762_4xsRetUOOw5Ld1Nlq0uB055CLpRxGVlB.jpg",
          preview: false,
        },
        {
          groupId: 5,
          url: "https://img.freepik.com/free-photo/group-portrait-adorable-puppies_53876-148018.jpg",
          preview: true,
        },
        {
          groupId: 5,
          url: "https://img.freepik.com/free-photo/young-woman-park-with-her-white-dog_1303-11499.jpg",
          preview: false,
        },
        {
          groupId: 6,
          url: "https://img.freepik.com/free-photo/people-exercising-sport-concept-happy-caucasian-man-dark-skinned-woman-raise-dumbbells-carry-fitness-mat-have-toothy-smiles_273609-30880.jpg",
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
    options.tableName = "GroupImages";
    await queryInterface.bulkDelete(options);
  },
};
