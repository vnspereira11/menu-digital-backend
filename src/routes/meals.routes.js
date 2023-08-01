const { Router } = require("express");

const MealsController = require("../controllers/MealsController");

const mealsRoutes = Router();

const mealsController = new MealsController();

mealsRoutes.post("/:user_id", mealsController.create);
mealsRoutes.get("/:id", mealsController.show);
mealsRoutes.put("/:id", mealsController.update);
mealsRoutes.delete("/:id", mealsController.delete);

module.exports = mealsRoutes;
