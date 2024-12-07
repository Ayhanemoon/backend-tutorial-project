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
  security: [{ BearerAuth: [] }]
};
swaggerAutogen('./swagger-output.json', ['../index.js', '../product/routes/categories.js'], doc);
