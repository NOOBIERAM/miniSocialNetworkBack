'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Association avec User (expéditeur)
      Message.belongsTo(models.User, {
        as: 'Sender',
        foreignKey: 'senderId'
      });

      // Association avec User (destinataire)
      Message.belongsTo(models.User, {
        as: 'Receiver',
        foreignKey: 'receiverId'
      });
    }
  }
  Message.init({
    content: DataTypes.TEXT,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};