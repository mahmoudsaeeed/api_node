const express = require('express');
const router = express.Router();
const controller = require('../../controllers/products_controller');
const authunticateToken = require('../../middleware/auth_middleware');
const endPoints = require('../endpoints');


router.post(endPoints.productsEndPoint,authunticateToken ,controller.add_product );


router.get(endPoints.productsEndPoint, authunticateToken ,controller.get_all_products);



module.exports = router;
