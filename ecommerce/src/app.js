const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/.env`});

const settingController = require('./setting/controllers/settingController');

const express = require('express');
const routes = require('./index');

require('./config/mongo');

const app = express();
app.use(express.json());
app.use('/', routes);

settingController.reloadInvoiceEvent();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

