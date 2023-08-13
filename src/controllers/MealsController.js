const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class MealsController {
  async create(request, response) {
    const { name, category, ingredients, price, description } = request.body;

    const user_id = request.user.id;
    const user = await knex("users").where({ id: user_id }).first();
    const isAdmin = user.admin === 1;

    let image = null;
    let filename = null;

    const diskStorage = new DiskStorage();

    if (!name || !category || !price || !description) {
      throw new AppError("Preencha os campos solicitados.");
    }

    if (!isAdmin) {
      throw new AppError("Sem permissão para cadastrar pratos.", 401);
    }

    if (request.file) {
      image = request.file.filename;
      filename = await diskStorage.saveFile(image);
    }

    const [meal_id] = await knex("meals").insert({
      image: image ? filename : null,
      name,
      category,
      price,
      description,
      user_id,
    });

    const ingredientsInsert = JSON.parse(ingredients).map((name) => {
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

  async index(request, response) {
    const { search } = request.query;

    const meals = await knex
      .select("meals.*")
      .from("meals")
      .innerJoin("ingredients", "meals.id", "=", "ingredients.meal_id")
      .whereLike("meals.name", `%${search}%`)
      .orWhereLike("ingredients.name", `%${search}%`)
      .groupBy("meals.name");

    return response.json(meals);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, category, ingredients, price, description } = request.body;

    const user_id = request.user.id;
    const user = await knex("users").where({ id: user_id }).first();
    const isAdmin = user.admin === 1;

    let image = null;
    let filename = null;

    const diskStorage = new DiskStorage();

    if (!name || !category || !ingredients || !price || !description) {
      throw new AppError("Preencha todos os campos");
    }

    if (!isAdmin) {
      throw new AppError("Sem permissão para atualizar pratos.", 401);
    }

    const meal = await knex("meals").where({ id }).first();

    filename = meal.image;

    if (request.file) {
      if (meal.image) {
        await diskStorage.deleteFile(meal.image);
      }
      image = request.file.filename;
      filename = await diskStorage.saveFile(image);
    }

    await knex("meals").where({ id }).update({
      image: filename,
      name,
      category,
      price,
      description,
      updated_at: knex.fn.now(),
    });

    const updatedIngredients = JSON.parse(ingredients).map((name) => {
      return {
        meal_id: id,
        name,
      };
    });

    await knex("ingredients").where({ meal_id: id }).delete();
    await knex("ingredients").insert(updatedIngredients);

    return response.status(200).json();
  }

  async delete(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const user = await knex("users").where({ id: user_id }).first();
    const isAdmin = user.admin === 1;

    if (!isAdmin) {
      throw new AppError("Sem permissão para excluir pratos.", 401);
    }

    await knex("meals").where({ id }).delete();
    return response.status(200).json();
  }
}

module.exports = MealsController;
