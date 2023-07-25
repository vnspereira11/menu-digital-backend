exports.up = (knex) =>
  knex.schema.createTable("meals", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users");
    table.text("image");
    table.text("name").notNullable();
    table.text("category").notNullable();
    table.float("price").notNullable();
    table.text("description").notNullable();
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("meals");
