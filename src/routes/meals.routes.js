const { Router } = require("express");
const MealsController = require("../controllers/MealsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const mealsRoutes = Router();

const mealsController = new MealsController();

mealsRoutes.use(ensureAuthenticated);
mealsRoutes.post("/:user_id", mealsController.create);
mealsRoutes.get("/:id", mealsController.show);
mealsRoutes.get("/", mealsController.index);
mealsRoutes.put("/:id", mealsController.update);
mealsRoutes.delete("/:id", mealsController.delete);

module.exports = mealsRoutes;
