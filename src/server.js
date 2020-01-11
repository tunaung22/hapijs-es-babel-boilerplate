import * as dotenv from 'dotenv';
import * as Handlebars from 'handlebars';
import * as Glue from '@hapi/glue';
import * as Confidence from 'confidence';
import Knex from 'knex';
import { Model } from 'objection';
import manifestJson from './config/manifest.json';
import * as knexfile from '../knexfile';

dotenv.config();
const init = async () => {
  try {
    /**
     * CONFIDENCE STORE & GLUE COMPOSITION
     */
    const manifest = new Confidence.Store(manifestJson).get('/', {
      env: process.env.NODE_ENV,
    });
    const composeOptions = { relativeTo: __dirname };
    const server = await Glue.compose(manifest, composeOptions);

    /**
     * SETUP VIEWS TEMPLATES
     */
    server.views({
      engines: { hbs: Handlebars },
      relativeTo: __dirname,
      path: './views/app',
      layout: true,
      layoutPath: './views/layouts',
      helpersPath: './helpers/view-helpers',
      partialsPath: './views/partials',
      isCached: false,
    });

    /**
     * SETUP DATABASE LAYER
     */
    let knexConfig;
    switch (process.env.NODE_ENV) {
      case 'production':
        knexConfig = knexfile.production;
        break;
      case 'development':
        knexConfig = knexfile.development;
        break;
      default:
        knexConfig = knexfile.development;
        break;
    }
    const knex = Knex(knexConfig);
    Model.knex(knex);

    /**
     * SERVER START
     */
    await server.start();

    server.log('info', `Server is running on -> ${server.info.uri} \n`);
  } catch (err) {
    throw new Error(err);
    // process.exit(1);
  }
};

init();
