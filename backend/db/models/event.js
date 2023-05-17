'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    venueId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Venues', key: 'id' },
      validate: {
        notNull: { msg: "Venue does not exist" }
      }
    },
    groupId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Groups', key: 'id' }
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "Name must be at least 5 characters" },
        len: { args: [5, 1000], msg: "Name must be at least 5 characters" }
      }
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notNull: { msg: "Description is required" },
        notEmpty: { msg: "Description is required" }
      }
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "Type must be Online or In person" },
        isIn: { args: [['Online', 'In person']], msg: "Type must be Online or In person" }
      }
    },
    capacity: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        isInt: { msg: "Capacity must be an integer" },
        notNull: { msg: "Capacity must be an integer" }
      }
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      validate: {
        isNumeric: { msg: "Price is invalid" },
        notNull: { msg: "Price is invalid" },
        min: { args: [0], msg: "Price is invalid" }
      }
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        notNull: { msg: "Start date is required" },
        isAfter: {
          args: [new Date()],
          msg: "Start date must be in the future"
        }
      }
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        notNull: { msg: "End date is required" },
        endDateAfterStartDate(value) {
          const end = value.getTime();
          const start = this.startDate.getTime();
          if (end < start) {
            throw new Error("End date is less than start date");
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
