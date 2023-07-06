'use strict';
const { Model } = require('sequelize');

const { v1 } = require('uuid');

const uuid = () => {
  const tokens = v1().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

module.exports = (sequelize, DataTypes) => {
  class PostLikes extends Model {
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
      this.belongsTo(models.Posts, {
        targetKey: 'postId',
        foreignKey: 'PostId',
      });
    }
  }
  PostLikes.init(
    {
      postlikeId: {
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
      PostId: {
        type: DataTypes.UUID,
        references: {
          model: 'Posts',
          key: 'postId',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      modelName: 'PostLikes',
    }
  );
  return PostLikes;
};
