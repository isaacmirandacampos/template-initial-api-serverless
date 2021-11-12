import fastify, { FastifyInstance } from 'fastify';
import '../shared/libs/aws';
import { errorHandler, schemaErrorFormatter } from '../shared/error';
import { processSchema } from '../shared/fastify';
import { routes as authenticationRoutes } from '../modules/Authentication';
import { routes as userRoutes } from '../modules/Users';

interface AppInterface {
  server: FastifyInstance;
}

class App implements AppInterface {
  server: FastifyInstance;

  constructor() {
    this.server = fastify({
      ajv: {
        customOptions: {
          coerceTypes: false,
          allErrors: true,

          // without this property all the "additionalProperties: false"
          // in the JSONSchema definitions WON'T work as intended because
          // AJV will remove the extra properties before the check can happen
          removeAdditional: false,
        },
      },
    });
    this.configs();
    this.routes();
  }

  private configs() {
    this.server.register(require('fastify-cors'), {
      origin: [/rentbrella\.com$/, /localhost\:\d+$/],
      credentials: true,
    });
    this.server.setErrorHandler(errorHandler);
    this.server.setSchemaErrorFormatter(schemaErrorFormatter);

    this.server.addHook('onRoute', (routeOptions) => {
      if (routeOptions?.schema) {
        processSchema(routeOptions.schema);
      }
    });
  }

  private routes() {
    this.server.register(authenticationRoutes, {
      prefix: '/v1/authentication',
    } as any);

    this.server.register(userRoutes, {
      prefix: '/v1/users',
    } as any);
  }
}

export default App;
