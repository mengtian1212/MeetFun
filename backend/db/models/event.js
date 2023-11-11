"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, { foreignKey: "eventId" });

      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: "eventId",
        otherKey: "userId",
      });
      Event.hasMany(models.Attendance, { foreignKey: "eventId" }); //

      Event.belongsTo(models.Group, { foreignKey: "groupId" });
      Event.belongsTo(models.Venue, { foreignKey: "venueId" });
    }
  }
  Event.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      venueId: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        // references: { model: 'Venues', key: 'id' },
      },
      groupId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        // references: { model: 'Groups', key: 'id' }
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: { msg: "Name must be at least 5 characters" },
          len: { args: [5, 1000], msg: "Name must be at least 5 characters" },
        },
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          notNull: { msg: "Description is required" },
          notEmpty: { msg: "Description is required" },
        },
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: { msg: "Type must be Online or In person" },
          isIn: {
            args: [["Online", "In person"]],
            msg: "Type must be Online or In person",
          },
        },
      },
      capacity: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          isInt: { msg: "Capacity must be an integer" },
          notNull: { msg: "Capacity must be an integer" },
        },
      },
      price: {
        // allowNull: false,
        type: DataTypes.DECIMAL,
        validate: {
          // isNumeric: { msg: "Price is invalid" },
          // notNull: { msg: "Price is invalid" },
          // min: { args: [0], msg: "Price is invalid" },
        },
      },
      startDate: {
        allowNull: false,
        type: DataTypes.DATE,
        validate: {
          notNull: { msg: "Start date is required" },
          isAfterCurrentTime(value) {
            const startDateTime = new Date(value).getTime();
            const currDateTime = new Date().getTime();
            if (startDateTime <= currDateTime) {
              throw new Error("Start date must be in the future");
            }
          },
        },
      },
      endDate: {
        allowNull: false,
        type: DataTypes.DATE,
        validate: {
          notNull: { msg: "End date is required" },
          endDateAfterStartDate(value) {
            const startDateTime = new Date(this.startDate).getTime();
            const endDateTime = new Date(value).getTime();
            if (endDateTime <= startDateTime) {
              throw new Error("End date must be after start date");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
