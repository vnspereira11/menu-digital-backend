const AppError = require("../utils/AppError");

class UsersController {
  create(request, response) {
    const { name, email, password, isAdmin } = request.body;

    if (!name) {
      throw new AppError("O nome é obrigatório.");
    }

    response.status(201).json({ name, email, password, isAdmin });
  }
}

module.exports = UsersController;
