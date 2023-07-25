const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MealsController {
  async create(request, response) {
    return response.status(201).json();
  }

  async update(request, response) {
    return response.status(200).json();
  }
}

module.exports = MealsController;
