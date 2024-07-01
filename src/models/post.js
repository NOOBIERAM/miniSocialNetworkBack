'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Une publication appartient à un utilisateur
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author'
      });

      // Une publication peut avoir plusieurs commentaires
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        as: 'comments'
      });
    }
  }
  Post.init({
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    image: DataTypes.STRING,
    like: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};