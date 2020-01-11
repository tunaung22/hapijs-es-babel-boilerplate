``` js
exports.up = (knex) => knex.schema
  .createTable('users', (table) => {
    table.uuid('id').notNullable().primary();
    table.text('username').notNullable().unique();
    table.text('email').notNullable().unique();
    table.text('password').notNullable();
    table.text('fullname').notNullable();
    table.text('nickname').notNullable();
    table.text('description');
    table.text('role');
    table.boolean('active').defaultTo(false);
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema
  .dropTableIfExists('users');
```