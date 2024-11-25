const ProductVariant = require('../models/productVariant');

exports.getAllProductVariants = async(req, res)=>{
  try {
    const productVariants = await ProductVariant.find({}, '-__v -updatedAt');
    return res.status(200).json(productVariants ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error retreiving product variants', error});
  }
};

exports.partiallyUpdateProductVariant = async(req, res) => {
  try {
    const {sku, stock, price} = req.body;
    const productVariant = await ProductVariant.findById(req.params.productVariantId);
    productVariant.sku = sku ?? productVariant.sku;
    productVariant.stock = stock ?? productVariant.stock;
    productVariant.price = price ?? productVariant.price;
    await productVariant.save();
    return res.status(201).json({message: 'Product variant updated successfully', productVariant});
  } catch (error) {
    return res.status(500).json({message: 'Error updating product variant.', error});
  }
};

exports.createProductVariantsByProduct = async (product) => {
  if (product.attributes) {
    await createProductVariants(product._id, product.name, product.attributes);
  }
  if (product.category.attributes) {
    await createProductVariants(product._id, product.name, product.category.attributes);
  }
};

exports.deleteProductVariantsByProductId = async (productId) => {
  await ProductVariant.deleteMany({productId});
};

async function createProductVariants (productId, productName, attributes) {
  attributes.map(attr =>
    attr.attributeValues.map(async val => {
      const savedProductVariant = await ProductVariant.findOne({
        'product.productId': productId,
        'attribute.attributeId': attr.attributeId,
        'attribute.attributeValue': val
      });
      if (!savedProductVariant) {
        const productVariant = new ProductVariant({
          product:{
            productId: productId,
            productName: productName
          },
          attribute : {
            attributeId: attr.attributeId,
            attributeName: attr.attributeName,
            attributeValue: val
          }});
        await productVariant.save();
      }
    })
  );
};