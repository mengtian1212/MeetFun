'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.belongsTo(models.Group, { foreignKey: 'groupId' });

      Venue.belongsToMany(models.Group, {
        through: models.Event,
        foreignKey: 'venueId',
        otherKey: 'groupId'
      });
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // references: { model: 'Groups', key: 'id' }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Street address is required" },
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "City is required" },
      }
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        notNull: { msg: "State is required" },
      }
    },
    lat: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 7),
      validate: {
        notNull: { msg: "Latitude is not valid" },
        isFloat: { msg: "Latitude is not valid" },
        // isLatLong: { msg: "Latitude is not valid" },
        min: {
          args: [-90],
          msg: "Latitude is not valid"
        },
        max: {
          args: [90],
          msg: "Latitude is not valid"
        }
      }
    },
    lng: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 7),
      validate: {
        notNull: { msg: "Longitude is not valid" },
        isFloat: { msg: "Longitude is not valid" },
        // isLatLong: { msg: "Longitude is not valid" },
        min: {
          args: [-180],
          msg: "Longitude is not valid"
        },
        max: {
          args: [180],
          msg: "Longitude is not valid"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
