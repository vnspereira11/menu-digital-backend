const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MealsController {
  async create(request, response) {
    const { name, category, ingredients, price, description } = request.body;
    const { user_id } = request.params;

    const user = await knex("users").where({ id: user_id }).first();

    if (user.admin === 0) {
      throw new AppError("Sem permissão para cadastrar pratos.");
    }

    if (!name || !category || !price || !description) {
      throw new AppError("Preencha os campos solicitados.");
    }

    const [meal_id] = await knex("meals").insert({
      name,
      category,
      price,
      description,
      user_id,
    });

    const ingredientsInsert = ingredients.map((name) => {
      return {
        meal_id,
        name,
      };
    });

    await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json();
  }

  async show(request, response) {
    const { id } = request.params;

    const meal = await knex("meals").where({ id }).first();
    const ingredients = await knex("ingredients")
      .where({ meal_id: id })
      .orderBy("name");

    return response.status(200).json({
      ...meal,
      ingredients,
    });
  }
}

module.exports = MealsController;
