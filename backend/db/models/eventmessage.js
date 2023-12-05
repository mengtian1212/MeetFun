"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventMessage.belongsTo(models.User, {
        foreignKey: "senderId",
        onDelete: "cascade",
      });
      EventMessage.belongsTo(models.EventChat, {
        foreignKey: "eventChatId",
        onDelete: "cascade",
      });
    }
  }
  EventMessage.init(
    {
      senderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onDelete: "cascade",
      },
      eventChatId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onDelete: "cascade",
      },
      content: DataTypes.STRING,
      wasEdited: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "EventMessage",
    }
  );
  return EventMessage;
};
