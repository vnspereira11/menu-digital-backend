exports.up = (knex) =>
  knex.schema.createTable("favorites", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users");
    table
      .integer("meal_id")
      .references("id")
      .inTable("meals")
      .onDelete("CASCADE");
  });

exports.down = (knex) => knex.schema.dropTable("favorites");
