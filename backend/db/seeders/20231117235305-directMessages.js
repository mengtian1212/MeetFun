"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const messages = [
  {
    directChatId: 1,
    senderId: 2,
    content: "Hello there!",
    wasEdited: false,
    createdAt: new Date("11 NOV 2023 10:00:00 EST"),
    updatedAt: new Date("11 NOV 2023 10:00:00 EST"),
  },
  {
    directChatId: 1,
    senderId: 1,
    content: "How are you?",
    wasEdited: false,
    createdAt: new Date("11 NOV 2023 10:01:00 EST"),
    updatedAt: new Date("11 NOV 2023 10:01:00 EST"),
  },
  {
    directChatId: 1,
    senderId: 2,
    content: "I'm doing well, thank you!",
    wasEdited: false,
    createdAt: new Date("11 NOV 2023 10:04:00 EST"),
    updatedAt: new Date("11 NOV 2023 10:04:00 EST"),
  },
  {
    directChatId: 2,
    senderId: 3,
    content: "Hey, how's it going?",
    wasEdited: false,
    createdAt: new Date("8 NOV 2023 17:15:00 EST"),
    updatedAt: new Date("8 NOV 2023 17:15:00 EST"),
  },
  {
    directChatId: 2,
    senderId: 1,
    content: "Not bad, just chilling. You?",
    wasEdited: false,
    createdAt: new Date("8 NOV 2023 17:16:00 EST"),
    updatedAt: new Date("8 NOV 2023 17:16:00 EST"),
  },
  {
    directChatId: 2,
    senderId: 3,
    content: "Same here. Any exciting plans for the day?",
    wasEdited: false,
    createdAt: new Date("8 NOV 2023 17:22:00 EST"),
    updatedAt: new Date("8 NOV 2023 17:22:00 EST"),
  },
  {
    directChatId: 2,
    senderId: 1,
    content: "Thinking of grabbing coffee later. Wanner join?",
    wasEdited: false,
    createdAt: new Date("8 NOV 2023 17:25:00 EST"),
    updatedAt: new Date("8 NOV 2023 17:25:00 EST"),
  },
  {
    directChatId: 3,
    senderId: 1,
    content: "Hey, there's a meetup for tech enthusiasts next week.",
    wasEdited: false,
    createdAt: new Date("5 NOV 2023 13:12:00 EST"),
    updatedAt: new Date("5 NOV 2023 13:12:00 EST"),
  },
  {
    directChatId: 3,
    senderId: 7,
    content: "Sounds interesting! What's the topic?",
    wasEdited: false,
    createdAt: new Date("5 NOV 2023 13:13:00 EST"),
    updatedAt: new Date("5 NOV 2023 13:13:00 EST"),
  },
  {
    directChatId: 3,
    senderId: 1,
    content: "It's about the latest advancements in AI and machine learning.",
    wasEdited: false,
    createdAt: new Date("5 NOV 2023 13:14:00 EST"),
    updatedAt: new Date("5 NOV 2023 13:14:00 EST"),
  },
  {
    directChatId: 3,
    senderId: 7,
    content:
      "Count me in! I've been wanting to stay updated on those topics. See you there!",
    wasEdited: false,
    createdAt: new Date("5 NOV 2023 13:16:00 EST"),
    updatedAt: new Date("5 NOV 2023 13:16:00 EST"),
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
    options.tableName = "DirectMessages";
    await queryInterface.bulkInsert(options, messages, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "DirectMessages";
    await queryInterface.bulkDelete(options);
  },
};
