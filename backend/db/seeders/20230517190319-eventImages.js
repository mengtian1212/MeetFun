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
          url: "https://d.newsweek.com/en/full/1989687/woman-playing-piano.webp?w=790&f=31d561264d5c942c692be9cbac0337f5",
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
        {
          eventId: 7,
          url: "https://a.cdn-hotels.com/gdcs/production81/d1247/c0664d9b-f990-44f2-8cfe-ed0541088c8a.jpg?impolicy=fcrop&w=1600&h=1066&q=medium",
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
          url: "https://www.levantina.com/blog/wp-content/uploads/2019/10/c1.jpg",
          preview: true,
        },
        {
          eventId: 11,
          url: "https://secure.meetupstatic.com/photos/event/9/9/a/6/600_514179334.webp?w=384",
          preview: true,
        },
        {
          eventId: 12,
          url: "https://img.freepik.com/free-photo/vibrant-colors-shapes-patterns-modern-mosaic-art-generated-by-ai_188544-29132.jpg?t=st=1688591034~exp=1688594634~hmac=1329abf351b99fc6a32b855d8cbe7badf8112c87a3e78df4f97b583a1175f941&w=1380",
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
