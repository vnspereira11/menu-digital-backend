const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password, admin } = request.body;

    if (!name || !email || !password) {
      throw new AppError("Preencha todos os campos.");
    }

    if (password.length < 6) {
      throw new AppError("A senha deve ter no mínimo 6 caracteres.");
    }

    const checkUserExists = await knex("users").where({ email }).first();
    if (checkUserExists) {
      throw new AppError("Este e-mail já está cadastrado.");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
      admin: admin ? 1 : 0,
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("Usuário(a) não encontrado(a).");
    }

    const userWithUpdatedEmail = await knex("users").where({ email: user.email }).first();

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está cadastrado.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Informe a senha antiga para definir a nova senha.");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await knex("users")
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now(),
      })
      .where({ id });

    return response.status(200).json();
  }
}

module.exports = UsersController;
