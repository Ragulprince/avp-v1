import swaggerJsdoc from 'swagger-jsdoc';
import { Response } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AVP Academy API',
      version: '1.0.0',
      description: 'API documentation for AVP Academy EdTech Platform',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-domain.com/api' 
          : 'http://localhost:3000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
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
  apis: ['./src/routes/*.ts'], // paths to files containing OpenAPI definitions
};

export const specs = swaggerJsdoc(options);

// Custom CSS for swagger UI
export const customCss = `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info { margin: 50px 0 }
  .swagger-ui .scheme-container { 
    background: #fafafa; 
    padding: 30px 0; 
    border-bottom: 1px solid #ebebeb 
  }
`;

// Swagger UI options
export const swaggerUiOptions = {
  customCss,
  customSiteTitle: 'AVP Academy API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
  }
};

// API Documentation endpoint
export const serveApiDocs = (res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>AVP Academy API Docs</title>
        <link rel="stylesheet" type="text/css" href="/swagger-ui-bundle.css" />
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin:0; background: #fafafa; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            url: '/api-docs.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.presets.standalone
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
        </script>
      </body>
    </html>
  `;
  
  res.send(html);
};

// Health check documentation
export const healthCheckDocs = {
  '/health': {
    get: {
      summary: 'Health Check',
      description: 'Check if the API is running',
      responses: {
        200: {
          description: 'API is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'OK'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  },
                  uptime: {
                    type: 'number'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// API info endpoint
export const getApiInfo = (res: Response) => {
  res.json({
    name: 'AVP Academy API',
    version: '1.0.0',
    description: 'EdTech Platform API',
    documentation: '/api-docs',
    health: '/health'
  });
};
