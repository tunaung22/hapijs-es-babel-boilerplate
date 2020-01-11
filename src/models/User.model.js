// Referernce: [link]https://github.com/Vincit/objection.js/blob/master/examples/koa/models/Person.js
import { Model } from 'objection';


export default class UserModel extends Model {
  static get tableName() {
    return 'users';
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'email', 'password'],
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        fullname: { type: 'string' },
        nickname: { type: 'string' },
        description: { type: 'string' },
        role: { type: 'string' },
        active: { type: 'boolean' },
      },
    };
  }

  // Modifiers are reusable query snippets that can be used in various places.
  static get modifiers() {
    return {
      // searchByUsername(query, username) {
      //   query.where((query) => {
      //     // ...
      //   });
      // },
      // searchById(query, id) {
      //   query.where({ 'id': id })
      // }
    };
  }

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  static relationMappings() {
    // One way to prevent circular references
    // is to require the model classes here.
    // const Animal = require('./Animal')
    // const Movie = require('./Movie')

    return {
      // userRoles: {
      //   relation: Model.HasManyRelation,
      //   // The related model. This can be either a Model subclass constructor or an
      //   // absolute file path to a module that exports one.
      //   modelClass: UserRoleModel,
      //   join: {
      //     from: 'user_role.id',
      //     to: 'user_role_id',
      //   },
      // },
    };
  }
}
