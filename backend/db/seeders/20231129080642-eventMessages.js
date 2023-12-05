"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const messages = [
  // eventChat 1, "Electronic Music Meet and Greet"
  // startDate: new Date("1 DEC 2023 12:00:00 EST")
  // organizer 1, member 2,3
  {
    eventChatId: 1,
    senderId: 1,
    content: "Hey, is anyone else excited about the event?",
    wasEdited: false,
    createdAt: new Date("20 NOV 2023 10:00:00 EST"),
    updatedAt: new Date("20 NOV 2023 10:00:00 EST"),
  },
  {
    eventChatId: 1,
    senderId: 2,
    content: "Absolutely! I can't wait to hear some awesome electronic music.",
    wasEdited: false,
    createdAt: new Date("20 NOV 2023 10:05:00 EST"),
    updatedAt: new Date("20 NOV 2023 10:05:00 EST"),
  },
  {
    eventChatId: 1,
    senderId: 3,
    content: "Me too! Do we know who the DJ is going to be?",
    wasEdited: false,
    createdAt: new Date("20 NOV 2023 10:06:00 EST"),
    updatedAt: new Date("20 NOV 2023 10:06:00 EST"),
  },
  {
    eventChatId: 1,
    senderId: 2,
    content: "I heard it's DJ Spark Beats. They're supposed to be amazing!",
    wasEdited: false,
    createdAt: new Date("20 NOV 2023 10:07:20 EST"),
    updatedAt: new Date("20 NOV 2023 10:07:20 EST"),
  },
  {
    eventChatId: 1,
    senderId: 3,
    content:
      "Nice! I love DJ Spark Beats's mixes. This event is going to be epic!",
    wasEdited: false,
    createdAt: new Date("20 NOV 2023 10:08:20 EST"),
    updatedAt: new Date("20 NOV 2023 10:08:20 EST"),
  },

  // eventChat 2, "Gather and Play Piano Music in Winter"
  // startDate: new Date("30 DEC 2024 15:00:00 EST")
  // organizer 1, member 3,5
  {
    eventChatId: 2,
    senderId: 1,
    content: "Hey everyone! 🎹 Excited for the event?",
    wasEdited: false,
    createdAt: new Date("27 NOV 2023 19:50:20 EST"),
    updatedAt: new Date("27 NOV 2023 19:50:20 EST"),
  },
  {
    eventChatId: 2,
    senderId: 3,
    content:
      "Absolutely! I'm bringing some classical vibes to the Steinways. Who's joining?",
    wasEdited: false,
    createdAt: new Date("27 NOV 2023 19:51:20 EST"),
    updatedAt: new Date("27 NOV 2023 19:51:20 EST"),
  },
  {
    eventChatId: 2,
    senderId: 5,
    content:
      "Count me in! I'll be there to enjoy the tunes. Any specific requests?",
    wasEdited: false,
    createdAt: new Date("27 NOV 2023 19:53:20 EST"),
    updatedAt: new Date("27 NOV 2023 19:53:20 EST"),
  },
  {
    eventChatId: 2,
    senderId: 1,
    content:
      "Open to suggestions! Let's make it a diverse and melodic evening.",
    wasEdited: false,
    createdAt: new Date("28 NOV 2023 20:00:00 EST"),
    updatedAt: new Date("28 NOV 2023 20:00:00 EST"),
  },
  {
    eventChatId: 2,
    senderId: 1,
    content: "Community building is key!",
    wasEdited: false,
    createdAt: new Date("28 NOV 2023 20:00:40 EST"),
    updatedAt: new Date("28 NOV 2023 20:00:40 EST"),
  },

  // eventChat 3, "Options Mastery: The Basics of Options Trading Workshop"
  // startDate: new Date("20 SEPT 2024 17:00:00 EST")
  // organizer 2, member 4
  {
    eventChatId: 3,
    senderId: 4,
    content: "Hey everyone!",
    wasEdited: false,
    createdAt: new Date("15 OCT 2023 16:00:40 EST"),
    updatedAt: new Date("15 OCT 2023 16:00:40 EST"),
  },
  {
    eventChatId: 3,
    senderId: 2,
    content: "Hey welcome!🤓",
    wasEdited: false,
    createdAt: new Date("16 OCT 2023 8:20:40 EST"),
    updatedAt: new Date("16 OCT 2023 8:20:40 EST"),
  },

  // eventChat 4, "Real Estate Investing Sharing & Networking Event"
  // startDate: new Date("14 JUL 2024 20:00:00 PST")
  // organizer 2, member 1, 4
  {
    eventChatId: 4,
    senderId: 2,
    content:
      "Hey team! It's a casual meetup where we dive into real estate investing discussions. Bring your questions and experiences. I'm looking forward to facilitating some valuable conversations!",
    wasEdited: false,
    createdAt: new Date("10 OCT 2023 9:20:40 EST"),
    updatedAt: new Date("10 OCT 2023 9:20:40 EST"),
  },
  {
    eventChatId: 4,
    senderId: 1,
    content: "Awesome!",
    wasEdited: false,
    createdAt: new Date("10 OCT 2023 9:23:48 EST"),
    updatedAt: new Date("10 OCT 2023 9:23:48 EST"),
  },
  {
    eventChatId: 4,
    senderId: 2,
    content:
      "Still finalizing the details, but I'll make sure to keep you all in the loop. It's going to be an insightful session. Who's in?",
    wasEdited: false,
    createdAt: new Date("10 OCT 2023 9:25:48 EST"),
    updatedAt: new Date("10 OCT 2023 9:25:48 EST"),
  },
  {
    eventChatId: 4,
    senderId: 4,
    content: "Count me in!",
    wasEdited: false,
    createdAt: new Date("10 OCT 2023 9:51:48 EST"),
    updatedAt: new Date("10 OCT 2023 9:51:48 EST"),
  },
  {
    eventChatId: 4,
    senderId: 2,
    content:
      "Great! I'll send out the details soon. Excited to connect and learn together. 💬",
    wasEdited: false,
    createdAt: new Date("11 OCT 2023 19:25:48 EST"),
    updatedAt: new Date("11 OCT 2023 19:25:48 EST"),
  },

  // eventChat 5, "Unlocking the Power of AI: Hands On Machine Learning"
  // startDate: new Date("01 JUL 2024 17:15:00 PST")
  // organizer 3, member 4
  {
    eventChatId: 5,
    senderId: 4,
    content:
      "Hey Michael. I've got some questions about the event. Mind if I pick your brain?",
    wasEdited: false,
    createdAt: new Date("21 OCT 2023 22:25:48 EST"),
    updatedAt: new Date("21 OCT 2023 22:25:48 EST"),
  },
  {
    eventChatId: 5,
    senderId: 3,
    content: "Of course! Shoot away.",
    wasEdited: false,
    createdAt: new Date("21 OCT 2023 22:28:48 EST"),
    updatedAt: new Date("21 OCT 2023 22:28:48 EST"),
  },
  {
    eventChatId: 5,
    senderId: 4,
    content: "Awesome! Who's the expert member giving the lightning talk?",
    wasEdited: false,
    createdAt: new Date("21 OCT 2023 22:30:48 EST"),
    updatedAt: new Date("21 OCT 2023 22:30:48 EST"),
  },
  {
    eventChatId: 5,
    senderId: 3,
    content:
      "We've got a seasoned practitioner with deep expertise in machine learning. They'll be sharing some valuable insights to kick off the workshop.",
    wasEdited: false,
    createdAt: new Date("21 OCT 2023 22:39:48 EST"),
    updatedAt: new Date("21 OCT 2023 22:39:48 EST"),
  },

  // eventChat 6, "Ice Cream Cooking Class"
  // startDate: new Date("15 Jul 2024 18:40:00 PDT")
  // organizer 5, member 2
  {
    eventChatId: 6,
    senderId: 2,
    content:
      "Hi organizer, I'm thinking of signing up. I wanna ask if I need a fancy setup?",
    wasEdited: false,
    createdAt: new Date("29 NOV 2023 12:39:48 EST"),
    updatedAt: new Date("29 NOV 2023 12:39:48 EST"),
  },
  {
    eventChatId: 6,
    senderId: 5,
    content:
      "We'll cover that - high-speed blenders and ice cream machines. Plus, tips on what to get and what to avoid.",
    wasEdited: false,
    createdAt: new Date("29 NOV 2023 15:39:48 EST"),
    updatedAt: new Date("29 NOV 2023 15:39:48 EST"),
  },

  // eventChat 7, "Acoustic Jam in Central Park!"
  // startDate: new Date("30 AUG 2023 15:00:00 EST")
  // organizer 1, member 3,5
  {
    eventChatId: 7,
    senderId: 5,
    content: "I've been looking for a reason to dust off my guitar. Who's in?",
    wasEdited: false,
    createdAt: new Date("20 AUG 2023 21:39:48 EST"),
    updatedAt: new Date("20 AUG 2023 21:39:48 EST"),
  },
  {
    eventChatId: 7,
    senderId: 3,
    content: "Count me in! Always up for some outdoor music fun.",
    wasEdited: false,
    createdAt: new Date("20 AUG 2023 23:39:48 EST"),
    updatedAt: new Date("20 AUG 2023 23:39:48 EST"),
  },
  {
    eventChatId: 7,
    senderId: 1,
    content:
      "Hey folks. Let's talk about song charts. Would you prefer to receive them in advance?",
    wasEdited: false,
    createdAt: new Date("22 AUG 2023 11:15:00 EST"),
    updatedAt: new Date("22 AUG 2023 11:15:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 3,
    content: "Yeah, that'd be helpful. Gives us time to practice a bit.",
    wasEdited: false,
    createdAt: new Date("22 AUG 2023 11:25:00 EST"),
    updatedAt: new Date("22 AUG 2023 11:25:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 1,
    content:
      "Absolutely! I'll make sure to email out song charts a week before the jam. Any thoughts on the location, Summit Rock?",
    wasEdited: false,
    createdAt: new Date("22 AUG 2023 11:39:00 EST"),
    updatedAt: new Date("22 AUG 2023 11:39:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 3,
    content:
      "Summit Rock is a great choice! Just include clear directions for those not familiar with the area.",
    wasEdited: false,
    createdAt: new Date("22 AUG 2023 11:49:00 EST"),
    updatedAt: new Date("22 AUG 2023 11:49:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 1,
    content:
      'Will do! I\'ll add detailed directions, and you should be able to use "Central Park Summit Rock" in your phone app for easy navigation.',
    wasEdited: false,
    createdAt: new Date("22 AUG 2023 11:50:00 EST"),
    updatedAt: new Date("22 AUG 2023 11:50:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 5,
    content:
      "Will there be any extra guitars available? I have a friend who wants to join but doesn't have one.",
    wasEdited: false,
    createdAt: new Date("23 AUG 2023 16:44:00 EST"),
    updatedAt: new Date("23 AUG 2023 16:44:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 1,
    content:
      "I'll make sure to have a few extra acoustic guitars available for anyone who wants to join in.",
    wasEdited: false,
    createdAt: new Date("23 AUG 2023 17:50:00 EST"),
    updatedAt: new Date("23 AUG 2023 17:50:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 3,
    content:
      "This is shaping up to be an amazing event! How about some fun activities during the jam?",
    wasEdited: false,
    createdAt: new Date("23 AUG 2023 21:50:00 EST"),
    updatedAt: new Date("23 AUG 2023 21:50:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 1,
    content:
      "Great idea! I'm thinking of having a few designated spots for solo performances or small groups. What do you all think?",
    wasEdited: false,
    createdAt: new Date("23 AUG 2023 23:22:00 EST"),
    updatedAt: new Date("23 AUG 2023 23:22:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 5,
    content: "Love the idea! It'll add a nice variety to the jam.",
    wasEdited: false,
    createdAt: new Date("24 AUG 2023 23:27:00 EST"),
    updatedAt: new Date("24 AUG 2023 23:27:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 1,
    content: "Fantastic!",
    wasEdited: false,
    createdAt: new Date("26 AUG 2023 11:46:00 EST"),
    updatedAt: new Date("26 AUG 2023 11:46:00 EST"),
  },
  {
    eventChatId: 7,
    senderId: 1,
    content:
      "Thanks for your input, everyone! This is going to be a memorable jam. Can't wait to see you all there! 🌳🎶",
    wasEdited: false,
    createdAt: new Date("26 AUG 2023 11:46:15 EST"),
    updatedAt: new Date("26 AUG 2023 11:46:15 EST"),
  },

  // eventChat 8, "River Camping, Fishing & Hiking"
  // startDate: new Date("28 NOV 2023 09:00:00 PDT")
  // organizer 5, member 1,3
  {
    eventChatId: 8,
    senderId: 5,
    content: "Can't wait for some riverside camping and mountain adventures.",
    wasEdited: false,
    createdAt: new Date("21 NOV 2023 11:46:15 EST"),
    updatedAt: new Date("21 NOV 2023 11:46:15 EST"),
  },
  {
    eventChatId: 8,
    senderId: 1,
    content:
      "Agreed! Keep us posted on the details. This is going to be epic! 🏕️🎣🏔️",
    wasEdited: false,
    createdAt: new Date("21 NOV 2023 20:46:15 EST"),
    updatedAt: new Date("21 NOV 2023 20:46:15 EST"),
  },

  // eventChat 9, "Cupcake Exchange: Uniting Cupcake Lovers for a Sweet Celebration of Flavors"
  // startDate: new Date("12 NOV 2023 11:00:00 PDT")
  // organizer 1, member 2
  {
    eventChatId: 9,
    senderId: 1,
    content:
      "I've got a killer red velvet cupcake recipe I've been dying to share.",
    wasEdited: false,
    createdAt: new Date("2 NOV 2023 13:50:15 EST"),
    updatedAt: new Date("2 NOV 2023 13:50:15 EST"),
  },
  {
    eventChatId: 9,
    senderId: 2,
    content: "I'm getting hungry just thinking about it.",
    wasEdited: false,
    createdAt: new Date("2 NOV 2023 18:08:15 EST"),
    updatedAt: new Date("2 NOV 2023 18:08:15 EST"),
  },

  // eventChat 10, "Let's Eat - Free Cooking Class"
  // startDate: new Date("07 DEC 2023 10:00:00 PDT")
  // organizer 1, member 2,3,4,5
  {
    eventChatId: 10,
    senderId: 1,
    content:
      "Hey, plant-based food enthusiasts! 🌱 Excited for our upcoming cooking class with Chef George Brown? We'll be making Skillet Lasagna and a Delicious White Bean Salad. It's free, and everyone's welcome!",
    wasEdited: false,
    createdAt: new Date("2 NOV 2023 15:03:19 EST"),
    updatedAt: new Date("2 NOV 2023 15:03:19 EST"),
  },
  {
    eventChatId: 10,
    senderId: 2,
    content:
      "That sounds amazing! Count me in. Where do we RSVP for the Zoom link?",
    wasEdited: false,
    createdAt: new Date("2 NOV 2023 16:25:19 EST"),
    updatedAt: new Date("2 NOV 2023 16:25:19 EST"),
  },
  {
    eventChatId: 10,
    senderId: 1,
    content:
      "Great to have you on board! Just hit me with a quick \"RSVP,\" and I'll send you the Zoom link. Let's aim to join 10 minutes before the class starts.",
    wasEdited: false,
    createdAt: new Date("2 NOV 2023 16:26:19 EST"),
    updatedAt: new Date("2 NOV 2023 16:26:19 EST"),
  },
  {
    eventChatId: 10,
    senderId: 3,
    content: "Love the idea! Are the recipes beginner-friendly?",
    wasEdited: false,
    createdAt: new Date("2 NOV 2023 16:28:19 EST"),
    updatedAt: new Date("2 NOV 2023 16:28:19 EST"),
  },
  {
    eventChatId: 10,
    senderId: 1,
    content:
      "Absolutely! Chef George designed them with all skill levels in mind. It's a learning experience for everyone.",
    wasEdited: false,
    createdAt: new Date("2 NOV 2023 16:33:19 EST"),
    updatedAt: new Date("2 NOV 2023 16:33:19 EST"),
  },
  {
    eventChatId: 10,
    senderId: 4,
    content: "Sounds fantastic! Is there a cost to attend?",
    wasEdited: false,
    createdAt: new Date("8 NOV 2023 20:33:19 EST"),
    updatedAt: new Date("8 NOV 2023 20:33:19 EST"),
  },
  {
    eventChatId: 10,
    senderId: 1,
    content: "It's free to join",
    wasEdited: false,
    createdAt: new Date("8 NOV 2023 20:35:19 EST"),
    updatedAt: new Date("8 NOV 2023 20:35:19 EST"),
  },
  {
    eventChatId: 10,
    senderId: 1,
    content: "but we welcome donations to support these events.",
    wasEdited: false,
    createdAt: new Date("8 NOV 2023 20:36:19 EST"),
    updatedAt: new Date("8 NOV 2023 20:36:19 EST"),
  },
  {
    eventChatId: 10,
    senderId: 1,
    content: "If you can, a suggested donation of $5 to $10 would be awesome.",
    wasEdited: false,
    createdAt: new Date("8 NOV 2023 20:37:19 EST"),
    updatedAt: new Date("8 NOV 2023 20:37:19 EST"),
  },
  {
    eventChatId: 10,
    senderId: 4,
    content:
      "Definitely worth it! Looking forward to the cooking class and connecting with fellow plant-based enthusiasts.🌿🍲",
    wasEdited: false,
    createdAt: new Date("8 NOV 2023 22:17:19 EST"),
    updatedAt: new Date("8 NOV 2023 22:17:19 EST"),
  },

  // eventChat 11, "Wine Tasting Social in NYC"
  // startDate: new Date("30 JUN 2023 18:30:00 EST")
  // organizer 5

  // eventChat 12, "Potluck & Board Games"
  // startDate: new Date("11 JUN 2023 12:00:00 PDT")
  // organizer 5, member 1, 3
  {
    eventChatId: 12,
    senderId: 5,
    content:
      "Hey board gamers! Planning our next game night. What's everyone in the mood for?",
    wasEdited: false,
    createdAt: new Date("6 JUN 2023 18:10:19 EST"),
    updatedAt: new Date("6 JUN 2023 18:10:19 EST"),
  },
  {
    eventChatId: 12,
    senderId: 1,
    content:
      "How about diving into the classics? Ticket to Ride or Splendor, perhaps?",
    wasEdited: false,
    createdAt: new Date("6 JUN 2023 18:22:39 EST"),
    updatedAt: new Date("6 JUN 2023 18:22:39 EST"),
  },
  {
    eventChatId: 12,
    senderId: 3,
    content:
      "Great choices! I'm also up for something new. Any recommendations?",
    wasEdited: false,
    createdAt: new Date("6 JUN 2023 19:40:39 EST"),
    updatedAt: new Date("6 JUN 2023 19:40:39 EST"),
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
    options.tableName = "EventMessages";
    await queryInterface.bulkInsert(options, messages, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "EventMessages";
    await queryInterface.bulkDelete(options);
  },
};
