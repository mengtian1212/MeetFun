'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.Group, { foreignKey: 'groupId' });
    }
  }
  Membership.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // references: { model: 'Users', key: 'id' }
      onDelete: 'cascade'
    },
    groupId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // references: { model: 'Groups', key: 'id' }
      onDelete: 'cascade'
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: { args: [['pending', 'member', 'co-host', 'organizer']], msg: "Membership status must be 'pending', 'member', 'co-host', or 'organizer'." }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
