require('dotenv').config({path:`${__dirname}\\.env`});
const express = require('express');
const routes = require('./routes/index');
const swaggerDocs = require('./config/swagger');
const mongoConfig = require('./config/mongo');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());
app.use('/api/v1/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoConfig.connect();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
