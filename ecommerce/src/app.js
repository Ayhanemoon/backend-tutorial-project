const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/.env`});

const express = require('express');
const routes = require('./index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger-output.json');
require('./config/mongo');

const app = express();
app.use(express.json());
app.use(routes);
app.use(process.env.ApiVersionAddress + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

