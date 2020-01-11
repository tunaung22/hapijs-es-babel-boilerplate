``` js
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid');


exports.seed = async (knex) => {
  // clearn up and insert
  await knex('users').del();
  await knex('users').insert([
    {
      id: uuidv4(),
      username: 'admin1',
      email: 'admin1@ssw.com',
      password: await bcrypt.hash('abc123', 12),
      fullname: 'admin nemo',
      nickname: 'admin-neemo',
      description: 'admin.',
      role: 'ADMIN',
      active: true,
    },
    {
      id: uuidv4(),
      username: 'superuser1',
      email: 'superuser1@ssw.com',
      password: await bcrypt.hash('abc123', 12),
      fullname: 'super user 1',
      nickname: 'supperuser1',
      description: 'a suepr user',
      role: 'SUPERUSER',
      active: true,
    },
    {
      id: uuidv4(),
      username: 'user1',
      email: 'user1@ssw.com',
      password: await bcrypt.hash('abc123', 12),
      fullname: 'user 1',
      nickname: 'supperuser1',
      description: 'a user',
      role: 'USER',
      active: true,
    },
  ]);
};
```
