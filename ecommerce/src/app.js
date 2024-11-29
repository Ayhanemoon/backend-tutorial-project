const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/.env`});

const express = require('express');
const routes = require('./index');

require('./config/mongo');

const app = express();
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

