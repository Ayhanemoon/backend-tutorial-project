const mongoose = require('mongoose');
const Product = require('../product/models/product');

mongoose.connect(process.env.MONGO_URI, { autoIndex: true })
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err=>console.error('Could not connect to MongoDB', err));

const updateIndexes = async() => {
  await Product.collection.dropIndexes();
  await Product.syncIndexes();
};

updateIndexes();