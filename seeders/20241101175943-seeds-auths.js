'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const auths = [];
    const users = await queryInterface.sequelize.query(`SELECT id FROM "Users";`);
    const userIds = users[0];

    for (let i = 0; i < 100; i++) {
      const password = "admin123";
      const hashedPassword = await bcrypt.hash(password, 10);

      auths.push({
        password: hashedPassword,
        confirmPassword: hashedPassword,
        userId: userIds[i % userIds.length].id, 
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('Auths', auths, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Auths', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
