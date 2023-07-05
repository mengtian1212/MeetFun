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
          url: "https://img.freepik.com/premium-vector/set-percussion-family-musical-instruments-vector-design-set-flat-style-percussion-music-clipart_695709-16.jpg?w=996",
          preview: false,
        },
        {
          groupId: 1,
          url: "https://img.freepik.com/free-photo/african-rastafarian-singer-male-wearing-blue-shirt-beanie-emotionally-writing-song-recording-studio-isolated-blue-background_613910-13750.jpg?w=1060&t=st=1688491865~exp=1688492465~hmac=6d88e444259cf550e4bf27ff91672740951516a02d49200e36350cf46434aa95",
          preview: false,
        },
        {
          groupId: 2,
          url: "https://img.freepik.com/free-photo/wall-street-sign-new-york-with-new-york-stock-exchange-background_268835-669.jpg?w=740&t=st=1688491961~exp=1688492561~hmac=c854c7a7bb037edf6bc9d739b1e8f2f0bd2b5626e549ea2661355c1f672ce236",
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
          url: "https://img.freepik.com/premium-photo/fresh-healthy-vegetables-falling-pan_738298-1829.jpg?w=1380",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://as2.ftcdn.net/v2/jpg/01/91/05/77/1000_F_191057762_4xsRetUOOw5Ld1Nlq0uB055CLpRxGVlB.jpg",
          preview: false,
        },
        {
          groupId: 5,
          url: "https://img.freepik.com/free-photo/group-portrait-adorable-puppies_53876-148018.jpg?w=1380&t=st=1688491049~exp=1688491649~hmac=3d0de52cd7ac9f6b42d29aaf3d911898f6798494d1f4d532a65b36172f043d9e",
          preview: true,
        },
        {
          groupId: 5,
          url: "https://img.freepik.com/free-photo/young-woman-park-with-her-white-dog_1303-11499.jpg?w=1060&t=st=1688492196~exp=1688492796~hmac=f26a4ed6800f8ab30f5390b491a37a5b6b3ca4b2de2171ca5b0ac253c32585ee",
          preview: false,
        },
        {
          groupId: 6,
          url: "https://img.freepik.com/free-photo/people-exercising-sport-concept-happy-caucasian-man-dark-skinned-woman-raise-dumbbells-carry-fitness-mat-have-toothy-smiles_273609-30880.jpg?w=1380&t=st=1688491443~exp=1688492043~hmac=4b93e0e1d86e4b0843f7fc9520cdc3f59b9060bda7466029232f33d3131fcfd0",
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
