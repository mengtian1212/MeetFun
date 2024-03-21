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
          url: "https://kvno-wordpress-spaces.nyc3.digitaloceanspaces.com/wp-content/uploads/2022/03/18043644/iStock-1129332575-749x500.jpg",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://assets.entrepreneur.com/content/3x2/2000/1641286563-Trading.jpg",
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
          url: "https://img.freepik.com/premium-photo/couple-taking-with-real-state-agent_23-2148346264.jpg",
          preview: false,
        },
        {
          eventId: 5,
          url: "https://img.freepik.com/free-vector/hand-drawn-world-music-day-background_23-2149424753.jpg",
          preview: false,
        },
        {
          eventId: 6,
          url: "https://as2.ftcdn.net/v2/jpg/01/72/79/35/1000_F_172793547_85JMqGBFFnIJYhR8SHocrak0iie0pVFn.jpg",
          preview: true,
        },
        {
          eventId: 6,
          url: "https://secure.meetupstatic.com/photos/event/4/f/d/9/600_512960441.webp",
          preview: false,
        },
        {
          eventId: 6,
          url: "https://img.freepik.com/free-vector/hand-drawn-ice-cream-blackboard-menu-template_52683-63807.jpg",
          preview: false,
        },
        {
          eventId: 6,
          url: "https://as2.ftcdn.net/v2/jpg/01/34/70/41/1000_F_134704156_jOe9FP7AVcQum5jUICTbCNdfsCRQ32Wd.jpg",
          preview: false,
        },
        {
          eventId: 7,
          url: "https://a.cdn-hotels.com/gdcs/production81/d1247/c0664d9b-f990-44f2-8cfe-ed0541088c8a.jpg",
          preview: true,
        },
        {
          eventId: 8,
          url: "https://hellscanyon.tours/wp-content/uploads/2023/01/RiverAdventuresInc-214207-Pieces-Fishing-Equipment-blogbanner1-1080x675.jpg",
          preview: true,
        },
        {
          eventId: 9,
          url: "https://secure.meetupstatic.com/photos/event/3/6/7/5/clean_507373941.webp",
          preview: true,
        },
        {
          eventId: 10,
          // url: "https://www.levantina.com/blog/wp-content/uploads/2019/10/c1.jpg",
          url: "https://img.freepik.com/free-psd/poster-with-cooking-home-theme_23-2148546698.jpg",
          preview: true,
        },
        {
          eventId: 11,
          url: "https://secure.meetupstatic.com/photos/event/9/9/a/6/600_514179334.webp",
          preview: true,
        },
        {
          eventId: 12,
          url: "https://img.freepik.com/free-photo/vibrant-colors-shapes-patterns-modern-mosaic-art-generated-by-ai_188544-29132.jpg",
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
    options.tableName = "EventImages";
    await queryInterface.bulkDelete(options);
  },
};
