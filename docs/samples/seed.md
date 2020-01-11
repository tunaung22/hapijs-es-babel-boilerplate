``` js
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid');


async function prepareData() {
  return {
    admin1_id: uuidv4(),
    admin1_password: await bcrypt.hash('abc123', 12),
    admin1_role: 'ADMIN',
    superuser1_id: uuidv4(),
    superuser1_password: await bcrypt.hash('abc123', 12),
    superuser1_role: 'SUPERUSER',
    user1_id: uuidv4(),
    user1_password: await bcrypt.hash('abc123', 12),
    user1_role: 'USER',
  };
}

exports.seed = async (knex) => {
  const data = prepareData();

  knex('users').del()
    .then(() => knex('users').insert([
      {
        id: data.admin1_password,
        username: 'admin1',
        email: 'admin1@ssw.com',
        password: data.admin1_password,
        fullname: 'admin nemo',
        nickname: 'admin-neemo',
        description: 'admin.',
        role: data.admin1_role,
        active: true,
      },
      {
        id: data.superuser1_id,
        username: 'superuser1',
        email: 'superuser1@ssw.com',
        password: data.superuser1_id,
        fullname: 'super user 1',
        nickname: 'supperuser1',
        description: 'a suepr user',
        role: data.superuser1_role,
        active: true,
      },
      {
        id: data.user1_id,
        username: 'user1',
        email: 'user1@ssw.com',
        password: data.user1_id,
        fullname: 'user 1',
        nickname: 'supperuser1',
        description: 'a user',
        role: data.user1_role,
        active: true,
      },

    ]));
};
```
