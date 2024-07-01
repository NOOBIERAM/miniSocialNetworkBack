'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Association avec User (demandeur)
      Friend.belongsTo(models.User, {
        as: 'Requester',
        foreignKey: 'userId'
      });
  
      // Association avec User (récepteur)
      Friend.belongsTo(models.User, {
        as: 'Receiver',
        foreignKey: 'friendId'
      });
    }
  }
  Friend.init({
    userId: DataTypes.INTEGER,
    friendId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};