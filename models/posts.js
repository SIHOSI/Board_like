'use strict';
const { Model } = require('sequelize');

const { v1 } = require('uuid');

const uuid = () => {
  const tokens = v1().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'UserId',
      });

      this.hasMany(models.Comments, {
        sourceKey: 'postId',
        foreignKey: 'PostId',
      });

      this.hasMany(models.PostLikes, {
        sourceKey: 'postId',
        foreignKey: 'PostId',
      });
    }
  }
  Posts.init(
    {
      postId: {
        type: DataTypes.UUID,
        defaultValue: () => uuid(),
        allowNull: false,
        primaryKey: true,
      },
      UserId: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'userId',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      postTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postContent: {
        type: DataTypes.STRING,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Posts',
    }
  );
  return Posts;
};
