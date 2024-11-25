const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'ECommerce',
    description: 'This is a simple ecommerce that consist of product, sale order, card and payment.'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

swaggerAutogen('./swagger-output.json', ['../index.js'], doc);
