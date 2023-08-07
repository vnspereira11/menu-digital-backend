const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrderMealsController {
  async create(request, response) {
    const user_id = request.user.id;
    const { amount, meal_id } = request.body;

    const user = await knex("users").where({ id: user_id }).first();
    const orderMeal = await knex("meals").where({ id: meal_id }).first();

    if (!user || !orderMeal) {
      throw new AppError("Usuário e/ou prato não encontrado.");
    }

    const checkMealAmount = amount > 0;

    if (!checkMealAmount) {
      throw new AppError("Adicione a quantidade de pratos ao pedido.");
    }

    const updateMealAmount = await knex("order_meals")
      .where({ user_id, meal_id })
      .first();

    if (updateMealAmount) {
      await knex("order_meals")
        .update({
          ...updateMealAmount,
          amount,
        })
        .where({ user_id, meal_id });
    } else {
      await knex("order_meals").insert({ user_id, meal_id, amount });
    }

    return response.status(201).json();
  }
}

module.exports = OrderMealsController;
