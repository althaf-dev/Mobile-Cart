var express = require('express');
var router = express.Router();
var adminHelper = require('../Helpers/adminHelper');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('Admin/AdminHome', { title: 'E-CART', admin: true });
});

// adding banner
router.post("/add-banner", (req, res) => {

  let img = req.files.image;
  img.mv("./public/images/banner/" + "banner.jpg");
  console.log(req.files.image.name)
});

router.get('/product-control', async(req, res) => {

  let products =await adminHelper.getProducts()
  res.render('Admin/ProductControl', { admin: true,products })
})

router.get("/productslist",async(req,res)=>{
  let products =await adminHelper.getProductNames()
  res.json({products});
})
router.get('/order-control',async (req,res)=>{

  let orders =  await adminHelper.getOrders();
  console.log(orders);
  res.render('Admin/OrderManagement',{orders});

})
router.get('/add-product', (req, res) => {

  res.render('Admin/AddProduct', { admin: true })
})

router.post('/add-product', (req, res) => {

  
 
  let img = req.files.product_image;
  adminHelper.addProduct(req.body).then((id) => {
    console.log(id); 
    img.mv("public/images/product-images/"+id+".jpeg")
    res.redirect("/admin/add-product");
  })
 
 
})
router.get('/banner-upload',(req,res)=>{
  res.render("Admin/Banner")
})
module.exports = router;
