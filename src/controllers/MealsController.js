const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MealsController {
  async create(request, response) {
    const { name, category, price, description } = request.body;
    return response.status(201).json({ name, category, price, description });
  }

  async update(request, response) {
    return response.status(200).json();
  }
}

module.exports = MealsController;
