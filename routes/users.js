
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('User/Home', { title: 'E-CART' ,admin:false });
});

module.exports = router;
