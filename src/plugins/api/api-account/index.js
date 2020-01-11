import userHandler from './handlers/userHandler.v1';


export async function register(server) {
  server.route({
    method: 'GET',
    path: '/v1/users',
    handler: userHandler.getUsers,
    options: {
      description: 'Get Users',
      notes: 'Returns all users',
      tags: ['api'], // ADD THIS TAG
    },
  });

  server.route({
    method: 'GET',
    path: '/v1/users/{id}',
    handler: userHandler.getUser,
    options: {
      description: 'Get a User',
      notes: 'Returns a user item by the id passed in the path.',
      tags: ['api'], // ADD THIS TAG
    },
  });

  server.route({
    method: 'POST',
    path: '/v1/users',
    handler: userHandler.createUser,
    options: {
      description: 'Create a User',
      notes: 'Create a user.',
      tags: ['api'], // ADD THIS TAG
    },
  });

  server.route({
    method: ['PUT', 'PATCH'],
    path: '/v1/users/{id}',
    handler: userHandler.updateUser,
    options: {
      description: 'Update a User',
      notes: 'update == put or patch',
      tags: ['api'],
    },
  });

  server.route({
    method: 'DELETE',
    path: '/v1/users/{id}',
    handler: userHandler.deleteUser,
    options: {
      description: 'Delete a User',
      notes: 'delete',
      tags: ['api'],
    },
  });

  server.route({
    method: ['PUT', 'PATCH'],
    path: '/v1/users/{id}/activate',
    handler: userHandler.activateUser,
    options: {
      description: 'Activate User',
      notes: 'put/patch',
      tags: ['api'],
    },
  });

  server.route({
    method: ['PUT', 'PATCH'],
    path: '/v1/users/{id}/deactivate',
    handler: userHandler.deactivateUser,
    options: {
      description: 'Activate User',
      notes: 'put/patch',
      tags: ['api'],
    },
  });
}
export const name = 'api-account-plugin';
export const version = '0.0.1';
// multiple: ,
// dependencies: ,
// once: ,
// pkg: ,
