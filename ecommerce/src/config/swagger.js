const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/../.env`});

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'ECommerce',
    description: 'This is a simple ecommerce that consist of product, sale order, card and payment.'
  },
  host: `localhost:${process.env.PORT}`,
  schemes: ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'string',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your bearer token in the format: Bearer <token>'
    }
  },
  security: [{ BearerAuth: [] }]
};
//, '../product/routes/categories.js'
swaggerAutogen('./swagger-output.json', ['../index.js'], doc);
