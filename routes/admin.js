var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Admin/AdminHome', { title: 'E-CART' ,admin:true });
});

// adding banner
router.post("/add-banner",(req,res)=>{

  let img = req.files.image;
  img.mv("./public/images/banner/"+req.files.image.name);
console.log(req.files.image.name)
});

module.exports = router;
