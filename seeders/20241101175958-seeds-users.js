'use strict';

const { Users } = require("../models"); 
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: 'Super Admin',
      email: 'superadmin@gmail.com',
      password: password,
      role: 'superadmin',
      age: 35,
      address: 'Rhino Streets',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    const users = await queryInterface.sequelize.query(`SELECT id FROM "Users" WHERE email = 'superadmin@gmail.com';`);
    const userId = users[0][0].id;

    await queryInterface.bulkInsert('Auths', [{
      email: 'superadmin@gmail.com',
      password: password,
      confirmPassword: password,
      userId: userId, // Link to Users table
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(`SELECT id FROM "Users" WHERE email = 'superadmin@gmail.com';`);
    const userId = users[0][0]?.id; // Dapatkan userId dari hasil query

    if (userId) {
      await queryInterface.bulkDelete('Auths', { email: 'superadmin@gmail.com' }, {});
      await queryInterface.bulkDelete('Users', { email: 'superadmin@gmail.com' }, {});
    }
  }
};
