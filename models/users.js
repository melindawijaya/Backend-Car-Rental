'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const { Auths } = sequelize.models;
  
  class Users extends Model {
    static associate(models) {
      Users.hasOne(Auths, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });

  return Users;
};