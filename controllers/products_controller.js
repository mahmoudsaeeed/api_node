// const productModel = require('../models/product_model');


// // إضافة منتج جديد
// async function add_product(req, res) {
//   try {
//     const userId = req.user.id;

//     const { name, price, imageUrl } = req.body;

//     const product = new productModel({
//       name,
//       price,
//       imageUrl,
//       ownerId: userId,
//     });

//     await product.save();

//     res.status(201).json(product);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to add product', error: error.message });
//   }
// }

// // جلب كل المنتجات
// async function get_all_products(req, res) {
//   try {
//     const products = await productModel.find();
//     res.status(200).json( products );
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch products', error: error.message });
//   }
// }

// module.exports = {
//   add_product,
//   get_all_products,


// }

const productModel = require('../models/product_model');


// إضافة منتج جديد
async function add_product(req, res) {
   try {
    const { name, description, price } = req.body;

    const product = await productModel.create({
      name,
      description,
      price,
      ownerId: req.user.id // ⬅ تأكد أن هذا الحقل موجود فعلاً
    });

    res.status(201).json(product);
  } catch (error) {
    
    console.error(" Error in add_product:", error); // الخطأ
    console.log(' req.user =', req.user);
    res.status(500).json({ message: "Internal server error" });

}
}

// جلب كل المنتجات
async function get_all_products(req, res) {
  try {
    const products = await productModel.find();
    res.status(200).json( products );
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
}

module.exports = {
  add_product,
  get_all_products,


}