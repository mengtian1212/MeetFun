"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { User, Group } = require("../models");

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
    // method 1: using bulkInsert
    const groups = [
      {
        /* group 1 */ name: "Music Mania Club: For All Genres Music Lovers & Players",
        about:
          "Welcome to the Music Lovers Club! Are you passionate about music? Do you find yourself constantly tapping your feet to the rhythm and humming your favorite tunes? Then this club is perfect for you! \nOur club offers a vibrant community of fellow music enthusiasts where you can connect, share, and discuss your favorite songs, albums, and artists. Discover new melodies, exchange recommendations, and broaden your musical horizons as we embark on this harmonious journey together. But it's not just about discussions and recommendations! We organize regular events where you can showcase your own musical talents, whether you're a singer, instrumentalist, or DJ. From open mic nights to jam sessions, you'll have the opportunity to share your skills and connect with fellow music lovers who appreciate your passion.\n So, dust off your headphones, tune up your instruments, and get ready to immerse yourself in the world of music. Join the Music Lovers Club today and let's create melodies, share stories, and experience the incredible power of music together! \nNote: The Music Lovers Club is open to all music enthusiasts, regardless of skill level or musical background. Whether you're a professional musician or simply enjoy listening to music, you'll find a warm and welcoming community here. Let's unite in our love for music!",
        type: "Online",
        private: false,
        city: "New York City",
        state: "NY",
        organizerId: 1,
      },
      {
        /* group 2 */ name: "Investor Networking Circle",
        about:
          "Welcome to the Investor Networking Circle, where the worlds of finance, entrepreneurship, and innovation converge. If you are passionate about investment strategies, financial markets, and connecting with like-minded professionals, this is the perfect meetup group for you.\nEmbrace the power of networking, learn from industry leaders, and gain valuable insights that can shape your investment journey. Join us at Investor Networking Circle and be part of a dynamic community that shares a common passion for investment success.\nTogether, let's navigate the world of finance, forge valuable connections, and unlock new investment opportunities. Expand your network, broaden your investment horizons, and elevate your investment game with Investor Networking Circle.",
        type: "In person",
        private: true,
        city: "Chicago",
        state: "IL",
        organizerId: 2,
      },
      {
        /* group 3 */ name: "Kaggle Challenge Enthusiasts",
        about:
          "Let's get together and enjoy the fun to tackle Kaggle challenges. Whether you are a beginner or an experienced practioner, this group provides a platform to collaborate, learn and sharpen your skills in data analysis and machine learning.",
        type: "Online",
        private: false,
        city: "San Jose",
        state: "CA",
        organizerId: 3,
      },
      {
        /* group 4 */ name: "Culinary Creators Unite",
        about:
          "Calling all food enthusiasts and culinary artists! Culinary Creators Unite is a vibrant meetup group dedicated to bringing together individuals who share a passion for all things food. Whether you're a professional chef, a home cook, or simply an adventurous foodie, this community welcomes you with open arms.\n Join us as we explore the world of flavors, techniques, and culinary creations. Our events are designed to inspire, educate, and connect like-minded individuals who appreciate the art of cooking and gastronomy. From interactive cooking workshops and tastings to culinary tours and food-related discussions, there's something for everyone to indulge in.\n Share your favorite recipes, exchange culinary tips and tricks, and unlock your creativity in the kitchen. Discover new ingredients, learn about diverse cuisines, and embrace the joy of cooking as we gather together to celebrate the culinary arts. Whether you're a seasoned pro or just starting your culinary journey, Culinary Creators Unite is the perfect platform to connect with fellow food enthusiasts, expand your culinary horizons, and create unforgettable gastronomic experiences.\n Come join us and let's embark on a culinary adventure together. Unleash your inner culinary creator and be part of this amazing community that celebrates the magic of food!",
        type: "In person",
        private: true,
        city: "Seattle",
        state: "WA",
        organizerId: 5,
      },
      {
        /* group 5 */ name: "Pet Lovers Social",
        about:
          "Join the Pet Lovers Society, a community dedicated to celebrating the joy and companionship that our furry friends bring into our lives.\n Whether you're a proud pet parent, an animal enthusiast, or simple adore the unconditional love that pets offer, this group is for you.\n We gather to share pet stories, exchange tips on pet care, and organize fun-filled activities for both humans and pets alike. From pet-friendly outings and playdates to informative sessions on pet health and training, we aim to create a supportive and nurturing environment for all pet lovers. Join us to connect with like-minded individuals, make new friends (both human and furry), and build a community centered around the well-being and happiness of our beloved pets. \nLet's wag tails, purr, and embrace and love of pets together in the Pet Lovers Social.",
        type: "Online",
        private: false,
        city: "Los Angeles",
        state: "CA",
        organizerId: 5,
      },
      {
        /* group 6 */ name: "Fitness Fanatics Tribe",
        about:
          "We gather to motivate and support each other in acheiving our fitness goals and leading an active lifestyle.",
        type: "In person",
        private: false,
        city: "Boston",
        state: "MA",
        organizerId: 5,
      },
    ];
    options.tableName = "Groups";
    await queryInterface.bulkInsert(options, groups, {});

    // method2: dynamic seeding
    // const groups = [
    //   {
    //     name: "FakeGroup1",
    //     about: "Perfect opporunity to connect with music lovers online.",
    //     type: "Online",
    //     private: false,
    //     city: "New York City",
    //     state: "NY",
    //     organizer: "Demo-lition"
    //   },
    //   {
    //     name: "FakeGroup2",
    //     about: "Join our investors group to learn all areas of investment opportunities.",
    //     type: "In person",
    //     private: true,
    //     city: "Chicago",
    //     state: "IL",
    //     organizer: "FakeUser3"
    //   },
    //   {
    //     name: "FakeGroup3",
    //     about: "Let's get together and enjoy the fun to tackle Kaggle challenges.",
    //     type: "Online",
    //     private: false,
    //     city: "San Jose",
    //     state: "CA",
    //     organizer: "FakeUser1"
    //   }
    // ];

    // try {
    //   for (let group of groups) {
    //     const foundOrganizer = await User.findOne({
    //       where: { username: group.organizer }
    //     });
    //     await Group.create({
    //       organizerId: foundOrganizer.id,
    //       name: group.name,
    //       about: group.about,
    //       type: group.type,
    //       private: group.private,
    //       city: group.city,
    //       state: group.state,
    //     });
    //   };
    // } catch (err) {
    //   console.error(err);
    //   throw err;
    // };
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Groups";
    // const Op = Sequelize.Op;
    // await queryInterface.bulkDelete(options, {
    //   name: { [Op.in]: ['FakeGroup1', 'FakeGroup2', 'FakeGroup3'] }
    // }, {});
    await queryInterface.bulkDelete(options);
  },
};
