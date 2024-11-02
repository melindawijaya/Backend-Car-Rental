const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Auths, Users } = require("../models");

const register = async (req, res, next) => {
  try {
    const { name, age, role, address, password, email, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "Failed",
        message: "Passwords do not match",
        isSuccess: false,
        data: null,
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      name,
      age,
      role,
      address,
      password: hashedPassword,
      email
    });

    res.status(201).json({
      status: "Success",
      message: "Success register",
      isSuccess: true,
      data: {
        newUser,
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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = await Auths.findOne({
      include: [
        {
          model: Users,
          as: "user",
        },
      ],
      where :{
        email,
      },
    })

    if(!data) {
      return res.status(404).json({
        status: "Failed",
        message: "Email not registered",
        isSuccess: false,
        data: null,
      });
    }

    if(data && bcrypt.compareSync(password, data.password)) {
      const token = jwt.sign(
      {
        id: data.id,
        username: data.user.name,
        email: data.email,
        userId: data.user.id
      }, 
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRED
      }
    );

    res.status(200).json({
      status: "Success",
      message: "Login success",
      isSuccess: true,
      data: {
        username: data.user.name,
        token
      }
    });
  } else {
    res.status(401).json({
      status: "Failed",
      message: "Incorrect Password",
      isSuccess: false,
      data: null
    });
  }
    
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Login False",
      isSuccess: false,
      data: null
    });
  }
};

module.exports = {
  register,
  login,
};
