"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const events = [
  {
    /* event 1 */ venueId: 1,
    groupId: 1,
    name: "Electronic Music Meet and Greet",
    type: "Online",
    capacity: 30,
    price: 5,
    description:
      "Join us for one hour of laid back song sharing and social time.",
    // startDate: new Date('1 Oct 2023 10:00:00 EST'),
    // endDate: new Date('1 Oct 2023 11:00:00 EST')
    startDate: "2023-12-01 10:00:00",
    endDate: "2023-12-01 11:00:00",
  },
  {
    /* event 2 */ venueId: 4,
    groupId: 1,
    name: "Gather and play piano music in June",
    type: "In person",
    capacity: 58,
    price: 0,
    description:
      "Come and join us at Story Music Bar for our monthly in-person meeting to play and listen to their wonderful collection of Steinway pianos.\nJoin us in June for an enchanting piano music gathering. Bring your musical talents or simply come to enjoy the melodious tunes as we create a harmonious atmosphere together. It's a wonderful opportunity to connect with fellow piano enthusiasts, share your love for music, and immerse yourself in the joy of piano melodies. Let's gather, play, and celebrate the power of music this June.",
    // startDate: new Date('31 May 2023 14:00:00 EST'),
    // endDate: new Date('31 May 2023 16:00:00 EST')
    startDate: "2024-06-30 14:00:00",
    endDate: "2024-06-30 16:00:00",
  },
  {
    /* event 3 */ venueId: 2,
    groupId: 2,
    name: "Options Mastery: The Basics of Options Trading Workshop",
    type: "Online",
    capacity: 200,
    price: 90.85,
    description:
      "We will demystify the world of options and break down complex concepts into easy-to-understand terms. Whether you're a beginner or have limited experience in options trading, this workshop is designed to provide you with a solid foundation.\nJoin us and take the first step towards mastering the art of options trading. Reserve your spot now and empower yourself with the tools and understanding to navigate the exciting world of options markets.",
    // startDate: new Date('20 AUG 2023 8:00:00 EST'),
    // endDate: new Date('20 AUG 2023 9:00:00 EST')
    startDate: "2025-09-20 8:00:00",
    endDate: "2025-09-20 9:00:00",
  },
  {
    /* event 4 */ venueId: 3,
    groupId: 2,
    name: "Real Estate Investing Sharing & Networking Event",
    type: "In person",
    capacity: 123,
    price: 62.16,
    description:
      "We talk about any topic related to Real Estate Investing that the group wants to bring up. Bring your questions along with your knowledge and experiences and share with the group! Register to expand your real estate investing career.",
    // startDate: new Date('20 JUL 2023 20:00:00 EST'),
    // endDate: new Date('21 JUL 2023 21:30:00 EST')
    startDate: "2025-07-14 20:00:00",
    endDate: "2025-07-14 21:30:00",
  },
  {
    /* event 5 */ venueId: 4,
    groupId: 3,
    name: "Hands On Machine Learning",
    type: "Online",
    capacity: 10,
    price: 12.5,
    description:
      "A casual event to attend a ML lightening talk presented by a member and to meet other programmers! Join us for an immersive and interactive hands-on workshop on machine learning. This meetup event is designed to provide you with practical experience and insights into the fascinating world of machine learning. \nDuring this workshop, you will dive deep into the foundations of machine learning algorithms, explore real-world datasets, and learn how to build and train your own machine learning models. Whether you're a beginner or have some experience in machine learning, this workshop caters to all skill levels. Our expert instructors will guide you through various hands-on exercises, allowing you to apply machine learning concepts to real-world scenarios. You'll gain hands-on experience with popular machine learning libraries and frameworks, as well as learn about data preprocessing, feature engineering, model evaluation, and more. Collaborate with fellow participants, share your learnings, and engage in lively discussions. \nThis workshop provides a supportive and inclusive environment, fostering learning and knowledge-sharing among attendees. By the end of the workshop, you'll have a solid understanding of machine learning principles, practical skills to build your own machine learning models, and the confidence to tackle real-world machine learning challenges. \nDon't miss out on this opportunity to expand your machine learning knowledge and enhance your data science skills. Reserve your spot now for this hands-on machine learning workshop and embark on an exciting journey into the world of intelligent algorithms",
    // startDate: new Date('12 Dec 2023 17:15:00 EST'),
    // endDate: new Date('13 Dec 2023 17:15:00 EST')
    startDate: "2024-07-01 08:15:00",
    endDate: "2024-07-03 17:15:00",
  },
  {
    /* event 6 */ venueId: 5,
    groupId: 4,
    name: "Ice Cream Cooking Class",
    type: "In person",
    capacity: 5,
    price: 95,
    description:
      "In this hands on cooking class, we will learn how to make ice cream out of nuts and we will make a blueberry vanilla ice cream. \n We will learn the basic vegan ice cream custard recipe and from that, any flavor can then be produced. \nWe will also learn how to make waffle bowls, maple walnuts, pineapple sauce and caramelized bananas and produce some wonderful ice cream sundaes that we will then dine upon.\nWe will also discuss equipment needed to make vegan ice creams (high speed blenders, ice cream machines) and what to look for and avoid when adding these to your kitchen.",
    // startDate: new Date('12 Dec 2023 17:15:00 EST'),
    // endDate: new Date('13 Dec 2023 17:15:00 EST')
    startDate: "2023-11-15 18:40:00",
    endDate: "2023-11-15 22:00:00",
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
    options.tableName = "Events";
    await queryInterface.bulkInsert(options, events, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Events";
    await queryInterface.bulkDelete(options);
  },
};
