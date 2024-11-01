'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: await bcrypt.hash('superadmin123', 10),
      role: 'superadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
