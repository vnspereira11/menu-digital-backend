const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FavoritesController {
  async create(request, response) {
    const user_id = request.user.id;
    const { meal_id } = request.body;

    const user = await knex("users").where({ id: user_id }).first();
    const meal = await knex("meals").where({ id: meal_id }).first();

    if (!user || !meal) {
      throw new AppError("Usuário ou prato não encontrados.");
    }

    const isFavorite = await knex("favorites")
      .where({ user_id, meal_id })
      .first();

    if (isFavorite) {
      throw new AppError("Você já favoritou esse prato.");
    }

    const [id] = await knex("favorites").insert({
      user_id: user_id,
      meal_id: meal_id,
    });

    return response.status(201).json({ id });
  }

  async index(request, response) {
    const user_id = request.user.id;

    const userFavorites = await knex("favorites")
      .select([
        "meals.id as meal_id",
        "meals.name",
        "meals.image",
        "favorites.id",
      ])
      .innerJoin("meals", "meals.id", "=", "favorites.meal_id")
      .where("favorites.user_id", user_id);

    return response.json(userFavorites);
  }

  async delete(request, response) {
    const { id } = request.params;
    await knex("favorites").where({ id }).delete();
    return response.status(200).json();
  }
}

module.exports = FavoritesController;
