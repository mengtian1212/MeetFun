"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DirectMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DirectMessage.belongsTo(models.User, {
        foreignKey: "senderId",
        onDelete: "cascade",
      });
      DirectMessage.belongsTo(models.DirectChat, {
        foreignKey: "directChatId",
        onDelete: "cascade",
      });
    }
  }
  DirectMessage.init(
    {
      senderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onDelete: "cascade",
      },
      directChatId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onDelete: "cascade",
      },
      content: DataTypes.STRING,
      wadEdited: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "DirectMessage",
    }
  );
  return DirectMessage;
};
