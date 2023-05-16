'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, { foreignKey: 'orgainzerId' });
    }
  }
  Group.init({
    organizerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(60),
      validate: {
        notNull: { msg: "Name must be 60 characters or less" },
        len: { args: [1, 60], msg: "Name must be 60 characters or less" }
      }
    },
    about: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notNull: { msg: "Name must be 60 characters or less" },
        len: { args: [50, 100000], msg: "About must be 50 characters or more" }
      }
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "Type must be 'Online' or 'In person'" },
        isIn: { args: [['Online', 'In person']], msg: "Type must be 'Online' or 'In person'" }
      }
    },
    private: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      validate: {
        notNull: { msg: "Private must be a boolean" },
        notEmpty: { msg: "Private must be a boolean" },
        isBoolean(value) {
          if (typeof (value) !== 'boolean') {
            throw new Error("Private must be a boolean");
          }
        }
      }
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "City is required" },
        notEmpty: { msg: "City is required" }
      }
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "State is required" },
        notEmpty: { msg: "State is required" }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
