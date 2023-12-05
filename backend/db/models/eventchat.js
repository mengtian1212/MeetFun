"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventChat.belongsTo(models.Event, {
        foreignKey: "eventId",
        onDelete: "cascade",
      });
    }
  }
  EventChat.init(
    {
      eventId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onDelete: "cascade",
      },
    },
    {
      sequelize,
      modelName: "EventChat",
    }
  );
  return EventChat;
};
