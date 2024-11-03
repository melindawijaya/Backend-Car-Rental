const { where } = require("sequelize");
const { Cars } = require("../models");
const { Op } = require("sequelize");
const { parse } = require("dotenv");

const createCar = async (req, res) => {
  const { plate, transmission, manufacture, model, type, year } = req.body;

  try {
    const newCar = await Cars.create({
      plate,
      transmission,
      manufacture,
      model,
      type,
      year,
    });

    res.status(201).json({
      status: "Success",
      message: "Success create new car",
      isSuccess: true,
      data: {
        newCar,
      },
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    } else if (error.name === "SequelizeDatabaseError") {
      return res.status(400).json({
        status: "Failed",
        message: error.message || "Database error",
        isSuccess: false,
        data: null,
      });
    } else {
      return res.status(500).json({
        status: "Failed",
        message: "An unexpected error occurred",
        isSuccess: false,
        data: null,
      });
    }
  }
};

const getAllCar = async (req, res) => {
  try {
    const {
      id,
      plate,
      transmission,
      manufacture,
      model,
      type,
      year,
      page,
      size,
    } = req.query;

    const carCondition = {};
    if (id) carCondition.id = id;
    if (manufacture)
      carCondition.manufacture = { [Op.iLike]: `%${manufacture}%` };
    if (plate) carCondition.plate = { [Op.iLike]: `%${plate}%` };
    if (transmission)
      carCondition.transmission = { [Op.iLike]: `%${transmission}%` };
    if (model) carCondition.model = { [Op.iLike]: `%${model}%` };
    if (type) carCondition.type = { [Op.iLike]: `%${type}%` };
    if (year) carCondition.year = year;

    const pageSize = parseInt(size) || 10;
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * pageSize;

    const totalCount = await Cars.count({
      where: carCondition,
    });

    const cars = await Cars.findAll({
      attributes: [
        "id",
        "plate",
        "transmission",
        "manufacture",
        "model",
        "type",
        "year",
      ],
      where: carCondition,
      limit: pageSize,
      offset,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: "Success",
      message: "Success get cars data",
      isSuccess: true,
      data: {
        totalData: totalCount,
        cars,
        pagination: {
          page: pageNum,
          size: pageSize,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    }

    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const getCarById = async (req, res) => {
  const id = req.params.id;

  try {
    const car = await Cars.findOne({
      where: {
        id,
      },
    });

    console.log(car);

    res.status(200).json({
      status: "Success",
      message: "Success get car data",
      isSuccess: true,
      data: {
        car
      },
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    }

    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const updateCar = async (req, res) => {
  const id = req.params.id;
  const { plate, transmission, manufacture, model, type, year } = req.body;

  try {
    const car = await Cars.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      res.status(404).json({
        status: "Failed",
        message: "Data not found",
        isSuccess: false,
        data: null,
      });
    }

    await Cars.update(
      {
        id,
        plate,
        transmission,
        manufacture,
        model,
        type,
        year,
      },
      {
        where: { id },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "Success update car",
      isSuccess: true,
      data: {
        car: {
          id,
          plate,
          transmission,
          manufacture,
          model,
          type,
          year,
        },
      },
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    }

    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const deleteCar = async (req, res) => {
  const id = req.params.id;

  try {
    const car = await Cars.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      return res.status(404).json({
        status: "Failed",
        message: "Data not found",
        isSuccess: false,
        data: null,
      });
    }

    await Cars.destroy({
      where: { id },
    });

    res.status(200).json({
      status: "Success",
      message: "Success delete car",
      isSuccess: true,
      data: null,
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    }

    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

module.exports = {
  carController: {
    createCar,
    getAllCar,
    getCarById,
    updateCar,
    deleteCar,
  },
};
