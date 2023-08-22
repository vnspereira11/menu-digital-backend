const { Router } = require("express");
const OrderMealsController = require("../controllers/OrderMealsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const orderMealsRoutes = Router();

const orderMealsController = new OrderMealsController();

orderMealsRoutes.use(ensureAuthenticated);
orderMealsRoutes.post("/", orderMealsController.create);
orderMealsRoutes.get("/show", orderMealsController.show);

module.exports = orderMealsRoutes;
