
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AVP Academy API',
      version: '1.0.0',
      description: 'AVP Academy EdTech Platform API Documentation',
      contact: {
        name: 'AVP Academy',
        email: 'support@avpacademy.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.avpacademy.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['STUDENT', 'TEACHER', 'ADMIN'] },
            avatar: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            duration: { type: 'string' },
            fees: { type: 'number' },
            subjects: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] }
          }
        },
        Quiz: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            subject: { type: 'string' },
            type: { type: 'string', enum: ['PRACTICE', 'MOCK', 'DAILY', 'SUBJECT_WISE', 'CUSTOM'] },
            duration: { type: 'integer' },
            totalMarks: { type: 'integer' },
            passingMarks: { type: 'integer' },
            isPublished: { type: 'boolean' }
          }
        },
        Video: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            subject: { type: 'string' },
            topic: { type: 'string' },
            videoUrl: { type: 'string' },
            duration: { type: 'integer' },
            views: { type: 'integer' },
            isPublished: { type: 'boolean' }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' },
                totalPages: { type: 'integer' }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AVP Academy API Documentation'
  }));
  
  // Serve swagger.json
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};
