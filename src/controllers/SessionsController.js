const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsControler {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("Usuário e/ou senha incorretos.", 401);
    }

    const passwordChecks = await compare(password, user.password);

    if (!passwordChecks) {
      throw new AppError("Usuário e/ou senha incorretos.", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });
    return response.json({ user, token });
  }
}

module.exports = SessionsControler;