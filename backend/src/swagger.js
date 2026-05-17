const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AtomQuest Goal Portal API',
      version: '1.0.0',
      description: 'API documentation for the Goal Setting & Tracking Portal',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Parse JSDoc from routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
