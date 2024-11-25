const Product = require('../models/product');
const {createProductVariantsByProduct, deleteProductVariantsByProductId} = require('../controllers/productVariantController');

exports.createProduct = async(req, res) => {
  try {
    const { name, price, category, attributes } = req.body;
    const product = new Product({name, price, category, attributes});
    await product.save();
    createProductVariantsByProduct(product);
    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating product', error });
  }
};

exports.getAllProducts = async(req, res)=>{
  try {
    const products = await Product.find({}, '-__v');
    return res.status(200).json(products ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving products', error});
  }
};

exports.getProductById = async(req, res)=>{
  try {
    const product = await Product.findById(req.params.productId, '-__v -_id');
    if (!product) {
      return res.status(404).json({message:'Product not found.'});
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving product', error});
  }
};

exports.updateProduct = async(req, res)=>{
  try {
    const { name, price, category, attributes} = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { name, price, category, attributes},
      { projection:'-__v -_id', new:true, runValidators:true});
    createProductVariantsByProduct(product);
    if (!product) {
      return res.status(404).json({message:'Product not found'});
    }
    return res.status(200).json({message:'Product updated successfully', product});
  } catch (error) {
    return res.status(500).json({message: 'Error updating product', error});
  }
};

exports.deleteProduct = async(req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) {
      return res.status(404).json({message:'Product not found'});
    }
    await deleteProductVariantsByProductId(product);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({message: 'Error deleting product', error});
  }
};

exports.updateAttributes = async(req, res) => {//add action
  try {
    const {attributes} = req.body;
    const product = await Product.findById(req.params.productId);
    product.attributes = attributes;
    await product.save();
    createProductVariantsByProduct(product);
    return res.status(201).json({message: 'Attributes updated successfully', product});
  } catch (error) {
    return res.status(500).json({message: 'Error updating product.', error});
  }
};