exports.handler = async () => {
  const products = require('../data/products.json');
  return { statusCode:200, body: JSON.stringify(products) };
};