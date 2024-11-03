'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: 'Super Admin',
      email: 'superadmin@gmail.com',
      password: await bcrypt.hash('superadmin123', 10),
      role: 'superadmin',
      age: 35,
      address: 'Rhino Streets',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'superadmin@gmail.com' }, {});
  }
};
