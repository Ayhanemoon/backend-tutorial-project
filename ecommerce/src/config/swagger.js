const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/../.env`});

const swaggerAutogen = require('swagger-autogen')();

// const doc = {
//   info: {
//     title: 'ECommerce',
//     description: 'This is a simple ecommerce that consist of product, sale order, card and payment.'
//   },
//   host: `localhost:${process.env.PORT}`,
//   schemes: ['http'],
//   components: {
//     securityDefinitions: {
//       apiKeyAuth: {
//         type: 'apiKey',
//         in: 'header', // can be 'header', 'query' or 'cookie'
//         name: 'X-API-KEY', // name of the header, query parameter or cookie
//         description: 'Some description...'
//       }
//     }
//   }
// };
//, '../product/routes/categories.js'

const doc = {
  info: {
    title: 'My API',
    description: 'API description' },
  host: 'localhost:3000',
  schemes: ['http'], // Use 'https' if your API runs on SSL
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your bearer token in the format: Bearer <token>'
    }
  },
  definitions: {},
  security: [{ BearerAuth: [] }],
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints related to authorization operations'
    },
    {
      name: 'User',
      description: 'Endpoints related to user operations'
    },
    {
      name: 'Category',
      description: 'Endpoints related to category operations'
    },
    {
      name: 'Attribute',
      description: 'Endpoints related to attribute operations'
    },
    {
      name: 'Product',
      description: 'Endpoints related to product operations'
    },
    {
      name: 'Product Variant',
      description: 'Endpoints related to product variant operations'
    },
    {
      name: 'Setting',
      description: 'Endpoints related to setting operations'
    },
    {
      name: 'Sales Order',
      description: 'Endpoints related to sales order operations'
    },
    {
      name: 'Invoice',
      description: 'Endpoints related to invoice operations'
    },
    {
      name: 'Payment',
      description: 'Endpoints related to payment operations'
    }
  ]
};
swaggerAutogen('./swagger-output.json', ['../index.js'], doc);
