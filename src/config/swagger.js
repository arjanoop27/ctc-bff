const swaggerJSDoc = require('swagger-jsdoc');
const schemas = require('./swagger.schemas');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Crack The Code - BFF API',
    version: '1.0.0',
    description: 'CTC backend-for-frontend APIs',
  },
  servers: [{ url: 'http://localhost:4000/ctc', description: 'Local' }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas,
  },
  security: [],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service is up',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    service: { type: 'string', example: 'ctc-bff' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterResponse' },
              },
            },
          },
          409: {
            description: 'User exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and get JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'JWT returned',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthTokenResponse' },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user id',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MeResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: [],
});

module.exports = { swaggerSpec };
