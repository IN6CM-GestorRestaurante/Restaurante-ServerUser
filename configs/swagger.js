'use strict';

import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurante User API',
      version: '1.0.0',
      description:
        'API REST de cara al cliente móvil para el Gestor de Restaurantes',
      contact: {
        name: 'Soporte Técnico',
      },
    },
    servers: [
      {
        url: 'http://localhost:3003/api/user',
        description: 'Servidor Local (Alias)',
      },
      {
        url: 'http://localhost:3003/restauranteUser/v1',
        description: 'Servidor Local (Kspots Aligned)',
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
  },
  apis: ['./src/**/*.js', './src/**/*.routes.js', './routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
