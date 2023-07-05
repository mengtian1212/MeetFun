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
          url: "https://secure.meetupstatic.com/photos/event/7/e/3/d/clean_431492317.webp",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://img.freepik.com/free-photo/caucasian-pianist-playing-chord-with-focus-generated-by-ai_188544-11104.jpg?t=st=1688500950~exp=1688501550~hmac=92afa30df696b4039c10d6b315fc32a45c376c0a083621d009c9c068e1d5fd3a&w=1380",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://cdn-ggnil.nitrocdn.com/rNcFJQpzIMsOVgisYGJujSATSJIOUVpu/assets/images/optimized/rev-628bfb6/wp-content/uploads/2023/03/trading-psychology-1024x576-760x.jpg",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://secure.meetupstatic.com/photos/event/d/9/7/f/clean_514075679.webp",
          preview: false,
        },
        {
          eventId: 4,
          url: "https://as1.ftcdn.net/v2/jpg/00/79/79/36/1000_F_79793671_meleoNf4WfB71wXmTMyJve7o4wLaSDk4.jpg",
          preview: false,
        },
        {
          eventId: 4,
          url: "https://as1.ftcdn.net/v2/jpg/05/15/41/42/1000_F_515414257_rhrMgIrCMDYgIzxjjY6NLYp4oVK44cWv.jpg",
          preview: true,
        },
        {
          eventId: 4,
          url: "https://img.freepik.com/premium-photo/couple-taking-with-real-state-agent_23-2148346264.jpg?w=1060",
          preview: false,
        },
        {
          eventId: 5,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg?t=st=1688422777~exp=1688423377~hmac=de576424628c68c4c89b716cdc5b5bc098b8c8fa65345029ea5e5efccc581c51",
          preview: false,
        },
        {
          eventId: 6,
          url: "https://as2.ftcdn.net/v2/jpg/01/72/79/35/1000_F_172793547_85JMqGBFFnIJYhR8SHocrak0iie0pVFn.jpg",
          preview: true,
        },
        {
          eventId: 6,
          url: "https://secure.meetupstatic.com/photos/event/4/f/d/9/600_512960441.webp?w=384",
          preview: false,
        },
        {
          eventId: 6,
          url: "https://img.freepik.com/free-vector/hand-drawn-ice-cream-blackboard-menu-template_52683-63807.jpg?w=1060&t=st=1688496320~exp=1688496920~hmac=00de89025cd700527e9ed89a6bbfe2885d4be1033112bc64838986c7eb7778a5",
          preview: false,
        },
        {
          eventId: 6,
          url: "https://as2.ftcdn.net/v2/jpg/01/34/70/41/1000_F_134704156_jOe9FP7AVcQum5jUICTbCNdfsCRQ32Wd.jpg",
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
