'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: 'Super Admin',
      role: 'superadmin',
      age: 35,
      address: 'Rhino Streets',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE name = 'Super Admin';`
    );
    const superAdminId = users[0][0].id;

    await queryInterface.bulkInsert('Auths', [{
      userId: superAdminId, // Link to the Users table
      password: await bcrypt.hash('superadmin123', 10),
      confirmPassword: await bcrypt.hash('superadmin123', 10),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE name = 'Super Admin';`
    );
    const superAdminId = users[0][0]?.id;

    if (superAdminId) {
      await queryInterface.bulkDelete('Auths', { userId: superAdminId }, {});
      await queryInterface.bulkDelete('Users', { id: superAdminId }, {});
    }
  }
};
