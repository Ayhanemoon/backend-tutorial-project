const swaggerAutogen = require('swagger-autogen')();
const { glob } = require('glob');

const doc = {
  info: {
    title: 'ECommerce',
    description: 'This is a simple ecommerce that consist of product, sale order, card and payment.'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

glob('**/routes/index.js', {absolute: true}).then(files => swaggerAutogen('./swagger-output.json', files, doc));
