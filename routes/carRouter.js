const router = require("express").Router();

const { carController } = require("../controllers/carController");
// const authenticate = require("../middleware/authenticate");

router.get("/", carController.getAllCar);
router.post("/", carController.createCar);
router.get("/:id",carController.getCarById);
router.patch("/:id", carController.updateCar);
router.delete("/:id", carController.deleteCar);

module.exports = router;