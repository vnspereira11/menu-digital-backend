exports.up = (knex) =>
  knex.schema.createTable("order_meals", (table) => {
    table.increments("id").primary();
    table.integer("amount");
    table.integer("user_id").references("id").inTable("users");
    table.integer("meal_id").references("id").inTable("meals");
  });

exports.down = (knex) => knex.schema.dropTable("order_meals");
