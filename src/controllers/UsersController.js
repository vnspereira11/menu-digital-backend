const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password, admin } = request.body;

    if (!name || !email || !password) {
      throw new AppError("Preencha todos os campos.");
    }

    const checkUserExists = await knex("users").where({ email }).first();
    if (checkUserExists) {
      throw new AppError("Este e-mail já está cadastrado.");
    }

    await knex("users").insert({
      name,
      email,
      password,
      admin: admin ? 1 : 0,
    });

    return response.status(201).json();
  }
}

module.exports = UsersController;
