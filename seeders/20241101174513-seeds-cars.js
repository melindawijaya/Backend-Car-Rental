'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const fs = require('fs');
    const path = require('path');

    const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/car.json'), 'utf-8'));

    await queryInterface.bulkInsert('Cars', carsData.map(car => ({
      id: car.id,       
      plate: car.plate,
      transmission: car.transmission,
      manufacture: car.manufacture,
      model: car.model,
      available: car.available,
      type: car.type,
      year: car.year,
      options: JSON.stringify(car.options), 
      specs: JSON.stringify(car.specs), 
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cars', null, {});
  }
};
