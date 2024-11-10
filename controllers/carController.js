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
      driverType,
      date,
      numberOfPassengers,
      page = 1,
      size = 10,
    } = req.query;

    const carCondition = {};

    // Menangani pencarian berdasarkan driverType (true/false)
    if (driverType !== undefined) {
      // Mengonversi driverType menjadi boolean
      const isAutomatic = driverType === 'true'; // Jika true, mencari mobil dengan transmisi otomatis
      carCondition.transmission = isAutomatic ? 'Automatic' : 'Manual';  // Jika false, mencari mobil dengan transmisi manual
    }

    // Menangani pencarian berdasarkan date (availableAt)
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        carCondition.availableAt = { [Op.lte]: parsedDate };  // Mencari mobil yang tersedia pada atau sebelum tanggal ini
      } else {
        return res.status(400).json({
          status: "Failed",
          message: "Invalid date format",
          isSuccess: false,
          data: null,
        });
      }
    }

    // Menangani pencarian berdasarkan numberOfPassengers (capacity)
    if (numberOfPassengers) {
      carCondition.capacity = { [Op.gte]: numberOfPassengers };  // Mencari mobil dengan kapasitas >= numberOfPassengers
    }

    const pageSize = parseInt(size);
    const pageNum = parseInt(page);
    const offset = (pageNum - 1) * pageSize;

    // Menghitung total data mobil yang cocok dengan filter
    const totalCount = await Cars.count({
      where: carCondition,
    });

    // Mengambil data mobil dengan filter dan pagination
    const cars = await Cars.findAll({
      attributes: [
        "id", "plate", "manufacture", "model", "image", "rentPerDay", "capacity", "description",
        "availableAt", "transmission", "type", "year", "options", "specs"
      ],
      where: carCondition,
      limit: pageSize,
      offset,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: "Success",
      message: "Successfully fetched car data",
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
    const product = await Cars.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Success get car data",
      isSuccess: true,
      data: {
        product,
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
