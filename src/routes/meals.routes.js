const { Router } = require("express");

const MealsController = require("../controllers/MealsController");

const mealsRoutes = Router();

const mealsController = new MealsController();

mealsRoutes.post("/", mealsController.create);
mealsRoutes.put("/edit/:id", mealsController.update);

module.exports = mealsRoutes;
