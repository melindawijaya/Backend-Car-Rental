"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cars extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cars.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      plate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transmission: DataTypes.STRING,
      manufacture: DataTypes.STRING,
      available: DataTypes.BOOLEAN,
      type: DataTypes.STRING,
      year: DataTypes.INTEGER,
      options: DataTypes.JSON,
      specs: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Cars",
    }
  );
  return Cars;
};
