'use strict';

const { v1 } = require('uuid');

const uuid = () => {
  const tokens = v1().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal(`'${uuid()}'`),
        allowNull: false,
        primaryKey: true,
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('Users');
  },
};
