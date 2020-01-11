import Bcrypt from 'bcrypt';
import Confidence from 'confidence';
import UserModel from '../../../models/User.model';
import appJson from '../../../config/app.json';


export const name = 'auth-plugin';
export const version = '0.0.1';

export async function register(server) {
  try {
    /**
     * CONFIDENCE
     */
    const securityManifest = new Confidence.Store(appJson).get('/security', { env: process.env.NODE_ENV });

    /**
     * PLUGIN DEPENDENCIES
     */
    server.dependency('@hapi/cookie', async () => {
      /**
       * AUTHENTICATION
       */
      server.auth.strategy('session', 'cookie', {
        cookie: {
          name: securityManifest.authentication.cookie.name,
          password: securityManifest.authentication.cookie.password,
          isSecure: securityManifest.authentication.cookie.isSecure,
          isHttpOnly: securityManifest.authentication.cookie.isHttpOnly,
          encoding: securityManifest.authentication.cookie.encoding,
          clearInvalid: securityManifest.authentication.cookie.clearInvalid,
          strictHeader: securityManifest.authentication.cookie.strictHeader,
          ttl: securityManifest.authentication.cookie.ttl,
        },
        redirectTo: '/login',
        validateFunc: async (request, session) => {
          // fetch from session
          const sid = session.id;

          // fetch from db
          const account = await UserModel.query()
            .select('id', 'username', 'email', 'role')
            .findOne({ id: sid });

          if (!account) {
            return { valid: false };
          }

          return {
            valid: true,
            credentials: {
              account,
              // scope: account.role,
            },
          };
        },
      });
      // your add other auth strategies here
      // ...

      // set default strategy
      server.auth.default('session');

      /**
       * LOGIN
       */
      server.route({
        method: 'GET',
        path: '/login',
        options: {
          // auth: false,
          // plugins: {
          //   crumb: {},
          // },
          auth: { mode: 'try' },
          description: 'Login Form',
          notes: 'Login user',
          tags: ['web'], // ADD THIS TAG
        },
        async handler(request, h) {
          if (request.auth.isAuthenticated) {
            return h.response().redirect('/');
          }

          // return h.view('auth/login_page',
          //   { crumb: request.plugins.crumb },
          //   { layout: 'login_layout' });
          return h.view('auth/login_page', {}, { layout: 'login_layout' });
        },
      });

      /**
       * LOGIN [POST]
       */
      server.route({
        method: 'POST',
        path: '/login',
        options: {
          auth: {
            mode: 'try',
          },
          description: 'POST Login Form',
          notes: 'POST:Login',
          tags: ['web'],
        },
        async handler(request, h) {
          // grab database
          const user = await UserModel.query()
            .select('id', 'username', 'email', 'password')
            .findOne({ username: request.payload.username });
          // compare
          const valid = await Bcrypt.compare(
            request.payload.password,
            user.password,
          );

          if (!user || !valid) {
            // fail
            return h.view('auth/login_page', {
              error: {
                message: 'Authentication Failed',
                details: 'username or password not correct.',
              },
            });
          }

          /**
           * Valid username and password
           * set cookie
           */
          request.cookieAuth.set({ id: user.id, username: user.username });

          // redirect to home or user request page
          return h.redirect('/');
        },
      });

      /**
       * LOGOUT
       */
      server.route({
        method: 'GET',
        path: '/logout',
        async handler(request, h) {
          // clear cookie
          request.cookieAuth.clear();

          return h.redirect('/login');
        },
      });
    });

    /**
     * CRUMB GENERATOR
     */
    server.route({
      method: 'GET',
      path: '/generate',
      options: {
        // disable cors for security
        cors: false,
        auth: false,
      },
      async handler(request, h) {
        return h.response({ crumb: request.plugins.crumb });
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}
