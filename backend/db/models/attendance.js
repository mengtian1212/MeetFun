'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Attendance.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    eventId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // references: { model: 'Events', key: 'id  ' }
      onDelete: 'cascade'
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // references: { model: 'Users', key: 'id  ' }
      onDelete: 'cascade'
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: { args: [['attending', 'waitlist', 'pending']], msg: "Attendance status must be 'attending', 'waitlist' or 'pending'." }
      }
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
