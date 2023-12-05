"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DirectChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DirectChat.belongsTo(models.User, {
        foreignKey: "user1Id",
        onDelete: "cascade",
      });
      DirectChat.belongsTo(models.User, {
        foreignKey: "user2Id",
        onDelete: "cascade",
      });
    }
  }
  DirectChat.init(
    {
      user1Id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onDelete: "cascade",
      },
      user2Id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onDelete: "cascade",
      },
    },
    {
      sequelize,
      modelName: "DirectChat",
    }
  );
  return DirectChat;
};
