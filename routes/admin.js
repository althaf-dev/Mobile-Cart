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
  res.render('Admin/OrderManagement',{orders,admin:true});

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

router.get('/edit-product',(req,res)=>{

  let proName = req.query.proname;
  let price  = req.query.price;
  let brand  = req.query.br
  let stock  = req.query.st
  let proid  = req.query.proid
  let id     = req.query.id
  console.log(`Query= ${id}`)
  res.render('Admin/EditProducts',{proName,price,brand,stock,proid,id})

})
router.post('/edit-product/:id',(req,res)=>{
  let id = req.params.id
  console.log(`id is to update ${id}`)
  adminHelper.updateProduct(id,req.body).then(()=>{
    res.redirect('/admin/product-control')
  })
})
router.get('/banner-upload',(req,res)=>{
  res.render("Admin/Banner")
})

router.get('/view-order-products',async(req,res)=>{
  let orderId = req.query.id;
  let order = await adminHelper.getProductsFromOrder(orderId);
  // console.log(order[0]);
  res.render('Admin/ViewOrderProducts',{order:order,orderId:order[0]._id})
})
router.post('/update-order-products',async(req,res)=>{

  console.log("admin update");
  const status = Object.fromEntries(new URLSearchParams(req.body.status));
  await adminHelper.updateOrderProductStatus(req.body.orderId,req.body.proId,status);
  res.json({status:true});
})
module.exports = router;
