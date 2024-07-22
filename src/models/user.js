'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post,{
        foreignKey: 'userId',
        as:'posts'
      });
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments'
      });
      User.hasMany(models.Friend, {
        foreignKey: 'userId',
        as: 'friends'
      });
      User.hasMany(models.Message, {
        foreignKey: 'senderId',
        as: 'sentMessages'
      });
  
      // Un utilisateur peut avoir plusieurs messages (reçus)
      User.hasMany(models.Message, {
        foreignKey: 'receiverId',
        as: 'receivedMessages'
      });
      User.hasOne(models.LikePost, {
        foreignKey: 'userId',
        as: 'likePost'
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    firstname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};