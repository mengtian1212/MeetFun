"use strict";
const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Group, { foreignKey: "organizerId" });

      User.hasMany(models.Membership, { foreignKey: "userId" });
      User.hasMany(models.Attendance, { foreignKey: "userId" });

      User.belongsToMany(models.Group, {
        through: models.Membership,
        foreignKey: "userId",
        otherKey: "groupId",
      });

      User.belongsToMany(models.Event, {
        through: models.Attendance,
        foreignKey: "userId",
        otherKey: "eventId",
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
          len: [3, 256],
          // isEmail: true
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      picture: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
        },
      },
    }
  );
  return User;
};
