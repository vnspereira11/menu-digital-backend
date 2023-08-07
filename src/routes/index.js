const { Router } = require("express");

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const mealsRouter = require("./meals.routes");
const favoritesRouter = require("./favorites.routes");
const orderMealsRouter = require("./orderMeals.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/meals", mealsRouter);
routes.use("/favorites", favoritesRouter);
routes.use("/order_meals", orderMealsRouter);

module.exports = routes;
