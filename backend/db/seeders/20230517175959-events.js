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
    type: "In person",
    capacity: 30,
    price: 5,
    description:
      "Join us for one hour of laid back song sharing and social time.",
    startDate: new Date("1 DEC 2023 12:00:00 EST"),
    endDate: new Date("1 DEC 2023 15:00:00 EST"),
    // startDate: "2023-12-01 10:00:00",
    // endDate: "2023-12-01 11:00:00",
  },
  {
    /* event 2 */ venueId: 13,
    groupId: 1,
    name: "Gather and Play Piano Music in Winter",
    type: "In person",
    capacity: 58,
    price: 0,
    description:
      "Come and join us at Story Music Bar for our monthly in-person meeting to play and listen to their wonderful collection of Steinway pianos.\nJoin us for an enchanting piano music gathering. Bring your musical talents or simply come to enjoy the melodious tunes as we create a harmonious atmosphere together. It's a wonderful opportunity to connect with fellow piano enthusiasts, share your love for music, and immerse yourself in the joy of piano melodies. Let's gather, play, and celebrate the power of music.",
    startDate: new Date("30 DEC 2024 15:00:00 EST"),
    endDate: new Date("30 DEC 2024 18:00:00 EST"),
    // startDate: "2024-12-30 09:00:00",
    // endDate: "2024-12-30 12:00:00",
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
    startDate: new Date("20 SEPT 2024 17:00:00 EST"),
    endDate: new Date("21 SEPT 2024 20:00:00 EST"),
    // startDate: "2025-09-20 8:00:00",
    // endDate: "2025-09-20 9:00:00",
  },
  {
    /* event 4 */ venueId: 3,
    groupId: 2,
    name: "Real Estate Investing Sharing & Networking Event",
    type: "In person",
    capacity: 123,
    price: 62.5,
    description:
      "We talk about any topic related to Real Estate Investing that the group wants to bring up. Bring your questions along with your knowledge and experiences and share with the group! Register to expand your real estate investing career.",
    startDate: new Date("14 JUL 2024 20:00:00 PST"),
    endDate: new Date("14 JUL 2024 21:30:00 PST"),
    // startDate: "2025-07-14 20:00:00",
    // endDate: "2025-07-14 21:30:00",
  },
  {
    /* event 5 */ venueId: 4,
    groupId: 3,
    name: "Unlocking the Power of AI: Hands On Machine Learning",
    type: "In person",
    capacity: 10,
    price: 12.99,
    description:
      "A casual event to attend a ML lightening talk presented by a member and to meet other programmers! Join us for an immersive and interactive hands-on workshop on machine learning. This meetup event is designed to provide you with practical experience and insights into the fascinating world of machine learning. \nDuring this workshop, you will dive deep into the foundations of machine learning algorithms, explore real-world datasets, and learn how to build and train your own machine learning models. Whether you're a beginner or have some experience in machine learning, this workshop caters to all skill levels. Our expert instructors will guide you through various hands-on exercises, allowing you to apply machine learning concepts to real-world scenarios. You'll gain hands-on experience with popular machine learning libraries and frameworks, as well as learn about data preprocessing, feature engineering, model evaluation, and more. Collaborate with fellow participants, share your learnings, and engage in lively discussions. \nThis workshop provides a supportive and inclusive environment, fostering learning and knowledge-sharing among attendees. By the end of the workshop, you'll have a solid understanding of machine learning principles, practical skills to build your own machine learning models, and the confidence to tackle real-world machine learning challenges. \nDon't miss out on this opportunity to expand your machine learning knowledge and enhance your data science skills. Reserve your spot now for this hands-on machine learning workshop and embark on an exciting journey into the world of intelligent algorithms.",
    startDate: new Date("01 JUL 2024 17:15:00 PST"),
    endDate: new Date("03 JUL 2024 20:15:00 PST"),
    // startDate: "2024-07-01 08:15:00",
    // endDate: "2024-07-03 17:15:00",
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
    startDate: new Date("15 Jul 2024 18:40:00 PDT"),
    endDate: new Date("15 Jul 2024 22:00:00 PDT"),
    // startDate: "2023-07-15 18:40:00",
    // endDate: "2023-07-15 22:00:00",
  },
  {
    /* event 7 */ venueId: 7,
    groupId: 1,
    name: "Acoustic Jam in Central Park!",
    type: "In person",
    capacity: 100,
    price: 0,
    description:
      'FREE ALL AGES. Bring your acoustic guitar, pack a picnic, and come jam out in Central Park!\nWe will email song charts out to everyone who has rsvp\'d about one week before our Central Park Jam! All levels welcome! Come to hang out or bring your guitar to play along. We will be at Summit Rock (near Central Park West and West 83rd St - enter the park at 85th St). You should also be able to put "Central Park Summit Rock" into your phone app for directions.\nJoin us, and meet other awesome music loving humans for some chill summer fun. Connect, make friends and enjoy playing music in the park!',
    startDate: new Date("30 AUG 2023 15:00:00 EST"),
    endDate: new Date("30 AUG 2023 18:00:00 EST"),
    // startDate: "2023-06-30 14:00:00",
    // endDate: "2023-06-30 17:00:00",
  },
  {
    /* event 8 */ venueId: 8,
    groupId: 6,
    name: "River Camping, Fishing & Hiking",
    type: "In person",
    capacity: 18,
    price: 100,
    description:
      "Annual Naches River Camping Hiking and Fishing!\nCampsite is located on the south side of Mount Rainer off the 410 HWY. About 120 minutes away.\nMore info at our group Zoom meetup on Wednesday 's Nights.\nLimited Space RSVP and pay up asap in person at any of our meetup events. RSVP will close soon.\nA $100 deposit is required asap limited space, a max of 18 cars and tents.",
    startDate: new Date("28 NOV 2023 09:00:00 PDT"),
    endDate: new Date("29 NOV 2023 16:00:00 PDT"),
    // startDate: "2023-06-28 18:00:00",
    // endDate: "2023-06-29 17:00:00",
  },
  {
    /* event 9 */ venueId: 9,
    groupId: 4,
    name: "Cupcake Exchange: Uniting Cupcake Lovers for a Sweet Celebration of Flavors",
    type: "In person",
    capacity: 70,
    price: 16,
    description:
      "Hello Baking Enthusiasts! We're hosting a delightful and delicious gathering for our cookbook club! Unleash your inner baker and join us for a Cupcake Exchange event at the beautiful Lake Merritt in Oakland.\nThis is a fantastic opportunity to showcase your favorite cupcake recipe, sample a diverse array of homemade treats, and connect with fellow club members in a fun, relaxed, and flavorful atmosphere.",
    startDate: new Date("12 NOV 2023 11:00:00 PDT"),
    endDate: new Date("12 NOV 2023 13:00:00 PDT"),
    // startDate: "2023-09-23 11:00:00",
    // endDate: "2023-09-23 13:00:00",
  },
  {
    /* event 10 */ venueId: 10,
    groupId: 4,
    name: "Let's Eat - Free Cooking Class",
    type: "Online",
    capacity: 30,
    price: 0,
    description:
      "Many of us discover that transitioning to a plant-based diet is a process, not an overnight switch. One gradually becomes familiar with the construction of a plant-based meal and grows accustomed to grains, beans, and veggies being the “meat” on the plate. \nPlease join Plant-Based Chef George Brown for this FREE veggie-friendly cooking class where you learn new recipes, receive the recipes, and have a place to build a community where you can ask questions.\nRecipes will be: Skillet Lasagna and a Delicious White Bean Salad\nTo attend class, please RSVP to view the Zoom link and sign in within 10 minutes of the start of class.\nYou can also contact the organizer with any questions.\nDonations are welcomed. The suggested donation is $5 to $10.",
    startDate: new Date("07 DEC 2023 10:00:00 PDT"),
    endDate: new Date("07 DEC 2023 14:00:00 PDT"),
    // startDate: "2023-11-07 10:00:00",
    // endDate: "2023-11-07 14:00:00",
  },
  {
    /* event 11 */ venueId: 11,
    groupId: 4,
    name: "Wine Tasting Social in NYC",
    type: "In person",
    capacity: 45,
    price: 35,
    description:
      "Wine will loosen you up after a long day of work as it doesn’t require an explanation or a returned favor! When managed properly, vineyards with diverse soil types in correlation with an appropriate terroir and flora, yield the best wines. Come discover the how and the why of vineyards! Socialize over a fun and interactive modern day wine tasting, in we which will navigate through 4 top vineyards and their wines to match with tasting notes in an enjoyable audience interactive presentation! At 7:45 pm, you will receive hearty appetizers along with full open bar wine pour until 9 pm!!!What to expect:\n* Event check in and pre meet and greet with fellow guests from 6:30 to 7 pm.\n* You will be tasting a delicious Sauvignon Blanc, Rose, Red Blend and Tempranillo complete with tasting notes from 7 to 7:45 pm!! The average price of these bottles are retailed at $35 and rated 92 points or higher from the top wine critics!! You will have the option to sit or stand during the tasting!\n* Delicious hearty appetizers will be served family style at 7:45 pm!\n* This experience is a Friday night party vibe as you will have the chance to connect, converse, dance while enjoying unlimited open bar pours of 4-5 varieties of top-rated wine until 9 pm!",
    startDate: new Date("30 JUN 2023 18:30:00 EST"),
    endDate: new Date("30 JUN 2023 21:00:00 EST"),
    // startDate: "2023-06-30 18:30:00",
    // endDate: "2023-06-30 21:00:00",
  },
  {
    /* event 12 */ venueId: 12,
    groupId: 4,
    name: "Potluck & Board Games",
    type: "In person",
    capacity: 10.89,
    price: 28,
    description:
      "Let's have some fun!\nPotluck! If you don't know what to bring, bring fruit or a salad or just call me for suggestions (no eggs, dairy, mayonnaise, gelatin, or meat). Raw fruits and veggies are great! If you want to share your snack with the hostess, keep in mind that I have several food allergies (Wheat, cinnamon, green bell peppers, water cress, parsley, and chocolate) that might prevent me from tasting your tasty treats. I usually supply gluten-free spaghetti.\n6:00 PM Let's play! We usually play games like Ticket to Ride, Splendor, Transamerica, Rack-O, Cable Car, 6 Cubes, Take a Chance, Blokus, and games brought by you and others. Please bring your favorite game to share with us.",
    startDate: new Date("11 JUN 2023 12:00:00 PDT"),
    endDate: new Date("11 JUN 2023 15:00:00 PDT"),
    // startDate: "2023-06-11 17:00:00",
    // endDate: "2023-06-11 23:00:00",
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
