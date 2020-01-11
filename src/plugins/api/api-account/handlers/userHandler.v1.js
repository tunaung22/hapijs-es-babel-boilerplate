// plugins/api/account/handler.ts
import { v4 as uuidv4 } from 'uuid';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
// import { userInfo } from 'os';
import securityHelper from '../../../../helpers/securityHelper';
import UserModel from '../../../../models/User.model';


/**
 * GET ALL USERS
 * @param request UserRequest extends Hapi.Request
 * @param h Hapi.Responsetoolkit
 */
const getUsers = async (request, h) => {
  // const paramId = request.params.id;
  try {
    // UserModel.query().findById();
    const result = await UserModel.query()
      .select(
        'id',
        'username',
        'email',
        'fullname',
        'nickname',
        'description',
        'active',
        'created_at',
        'updated_at',
        'user_access',
      );

    return h.response(result);
  } catch (error) {
    return Boom.badImplementation(error, error);
  }
};

/**
 * GET A USER
 * @param request UserRequest extends Hapi.Request
 * @param h Hapi.ResponseToolkit
 */
const getUser = async (request, h) => {
  const paramId = request.params.id;
  try {
    const result = await UserModel.query()
      .select(
        'username',
        'email',
      )
      .where('id', '=', paramId)
      .from('users')
      .where({ id: paramId });

    return h.response(result);
  } catch (error) {
    if (String(error).includes('invalid input syntax for type uuid')) {
      return Boom.badRequest('Invalid UUID Format', error);
    }
    return Boom.badImplementation(error.message, error);
  }
};


const createUser = async (request, h) => {
  const schema = Joi.object({
    id: Joi.string()
      .trim()
      .uuid()
      .required(),
    username: Joi.string()
      .trim()
      .required()
      .min(5),
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    fullname: Joi.string().trim(),
    nickname: Joi.string().trim(),
    description: Joi.string()
      .trim()
      .allow(''),
    active: Joi.boolean().default(false),
    user_access: Joi.string(),
  });

  try {
    // get new uuid
    const newId = uuidv4();

    // prepare payload
    const inputData = {
      id: newId,
      username: request.payload.username,
      email: request.payload.email,
      password: request.payload.password,
      fullname: request.payload.fullname,
      nickname: request.payload.nickname,
      description: request.payload.description,
      active: request.payload.active,
      user_access: JSON.stringify(request.payload.user_access),
    };

    // joi validation
    await schema.validateAsync(inputData, { abortEarly: false });

    // Hash password before saving
    inputData.password = await securityHelper.hashPassword(request.payload.password);

    /**
     * save to db
     * default HTTP::201
     */
    // prepare response payload
    const insertedRow = await UserModel.query().insertAndFetch(inputData);
    return h.response(insertedRow);
  } catch (error) {
    // joi error
    if (error.isJoi === true) {
      if (error.details) {
        // prepare payload
        let errorCount = 0;
        const errorDetails = [];
        await error.details.forEach((err) => {
          errorCount += 1;
          errorDetails.push(err);
        });
        const boomError = Boom.badRequest('Validation Error', error);
        // prepare error response
        const res = {
          ...boomError.output.payload,
          errorCount,
          errorDetails,
        };
        return h.response(res).code(res.statusCode);
      }

      if (error.name === 'UniqueViolationError') {
        const boomError = Boom.badRequest('Uniquie Violation Error', error);
        const res = {
          ...boomError.output.payload,
          columns: error.columns,
        };
        return h.response(res).code(res.statusCode);
      }
      return Boom.badRequest('Validation Fail', error);
    }
    return Boom.badImplementation(error.message, error);
  }
};

const updateUser = async (request, h) => {
  const schema = Joi.object({
    fullname: Joi.string().trim(),
    nickname: Joi.string().trim(),
    description: Joi.string()
      .trim()
      .allow(''),
    active: Joi.boolean().default(false),
    user_access: Joi.string(),
  });

  try {
    // prepare payload
    const idToDelete = request.params.id;
    const inputData = {
      // username: request.payload.username,
      // email: request.payload.email,
      // password: request.payload.password,
      fullname: request.payload.fullname,
      nickname: request.payload.nickname,
      description: request.payload.description,
      active: request.payload.active,
      user_access: JSON.stringify(request.payload.user_access),
    };

    // joi validation
    await schema.validateAsync(inputData, { abortEarly: false });

    // Hash password before saving
    // inputData.password = await securityHelper.hashPassword(request.payload.password);

    /**
     * save to db
     * default HTTP::
     */
    // prepare response payload
    const insertedRow = await UserModel.query().updateAndFetchById(idToDelete, inputData);
    return h.response(insertedRow);
  } catch (error) {
    return Boom.badImplementation(error);
  }
};

const deleteUser = async (request, h) => {
  try {
    // if success, return 1
    await UserModel.query().deleteById(request.params.id);
    return h.response({});
  } catch (error) {
    return Boom.badImplementation(error.message, error);
  }
};

const toggleUserStatus = async (request, h) => {
  try {
    const requestId = request.params.id;
    const userStatus = await UserModel.query().findById(requestId).select('active');
    const res = await UserModel.query().updateAndFetchById(requestId, { active: !userStatus });
    return h.response(res).code(200);
  } catch (error) {
    return Boom.badImplementation(error.message, error);
  }
};

const activateUser = async (request, h) => {
  try {
    const requestId = request.params.id;
    const res = await UserModel.query().updateAndFetchById(requestId, { active: true });
    return h.response(res).code(200);
  } catch (error) {
    return Boom.badImplementation(error.message, error);
  }
};

const deactivateUser = async (request, h) => {
  try {
    const requestId = request.params.id;
    const res = await UserModel.query().updateAndFetchById(requestId, { active: false });
    return h.response(res);
  } catch (error) {
    return Boom.badImplementation(error.message, error);
  }
};


export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  activateUser,
  deactivateUser,
};
