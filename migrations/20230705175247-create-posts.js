'use strict';

const { v1 } = require('uuid');

const uuid = () => {
  const tokens = v1().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      postId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal(`'${uuid()}'`),
        allowNull: false,
        primaryKey: true,
      },
      UserId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'userId',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      postTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postContent: {
        type: Sequelize.STRING,
      },
      likeCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  },
};
