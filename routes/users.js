var express = require('express');
var router = express.Router();
var userHelper = require('../Helpers/userHelper');

const verifiedLogin = function(req,res,next){


  console.log(req.session.user)
  if(req.session.user){

     next();
  }
  else{
    console.log("render")
     res.redirect('/login')
  }

}
/* GET home page. */
router.get('/', function(req, res, next) {
  let user= req.session.user;
  
  console.log(req.session.logedin)
  if (!req.session.logedin){

    req.session.destroy;
    user=null;
  }
  userHelper.getProducts('all').then((products)=>{

    console.log("session")
    if(user){
       console.log(user)
    }
   
    res.render('User/Home', { title: 'E-CART' ,admin:false ,products,user});
  });


});
router.get('/login',(req,res,next)=>{
  console.log("redirected")
  req.session.logedin=false;
  res.render('User/Login');
})

router.get('/signup',(req,res)=>{

  res.render('User/signup')
})

router.post('/signup',(req,res)=>{

 
  userHelper.doSignup(req.body).then(()=>{
    res.redirect('/login')
  })
})

router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((data)=>{
    req.session.logedin=true;
    req.session.user=req.body.mobile;
    res.redirect('/');
  })
})

router.post('/addProductsToCart',verifiedLogin, (req,res,next)=>{
  
  userHelper.addProductsToCart(req.body.id,req.session.user).then(()=>{
    res.json({status:true,user:req.session.user})
  })

})
router.get('/getTotalProduct',verifiedLogin,async(req,res)=>{

  let count = await userHelper.getTotalProduct(req.session.user);
  res.json({totalQty:count});
})

router.get("/cart",verifiedLogin,async (req,res)=>{

  let Total;
  userHelper.getCartProducts(req.session.user).then(async(cart)=>{
    console.log("cart recieved")
    if(cart.length){
      Total = await userHelper.getTotalPrice(req.session.user);
    }
    else{
      Total = 0;
    }
    console.log(cart)
    res.render('User/Cart',{cart,Total});
  });
  
})

router.post('/cartQuantityUpdate',verifiedLogin, (req,res,next)=>{
    userHelper.addProductsToCart(req.body.id,req.session.user,req.body.value).then(async()=>{
    console.log("done");
    let Total = await userHelper.getTotalPrice(req.session.user);
    setTimeout(()=>{
        userHelper.getCartProducts(req.session.user).then((cart)=>{
              res.json({status:true,user:req.session.user,cart,Total})
            });
    },2000);
  })
})

router.get('/checkout',async(req,res)=>{
  let Total = await userHelper.getTotalPrice(req.session.user);
  res.render('User/Checkout',{Total});
})

router.post('/placeorder',(req,res)=>{
  console.log(req.body);
  userHelper.placeOrder(req.session.user,req.body).then(()=>{
    res.json({status:true});
  })
})
router.get("/order-success" ,(req,res)=>{
  res.render("User/PlaceOrder");
  
})

router.get("/product-category",(req,res)=>{

    let category = req.query.cat;
    userHelper.getProducts(category).then((products)=>{
      res.render("User/ProductCategory",{products,category:category.toUpperCase()})
    });

})
router.post("/filter-product",(req,res)=>{
  userHelper.getProducts(req.body.category,Number(req.body.minPrice),Number(req.body.maxPrice)).then((products)=>{
    res.render("User/ProductCategory",{min:req.body.minPrice, max:req.body.maxPrice,products,category:req.body.category.toUpperCase()})
  })
})
router.post("/productsearch",async(req,res)=>{
  let product = await userHelper.findProduct(req.body.product_name);
  res.render("User/ProductSearchResult.hbs",{product})
})
router.get("/productsearch",async(req,res)=>{
  console.log(req.body)
  let product = await userHelper.findProduct(req.query.product_name);
  res.render("User/ProductSearchResult.hbs",{product})
})
router.get('/remove-cart-item',(req,res)=>{
  let id = req.query.id;
  let user = req.session.user;
  console.log("cart item remove",id);
  userHelper.removeCartItem(user,id).then(()=>{

    res.redirect('/cart');
  })
})
router.get('/orders',async(req,res)=>{
  let user = req.session.user;
  let orders = await userHelper.getOrders(user);
  console.log("orders");
  console.log(orders);
  res.render('User/Orders',{orders});
})
module.exports = router;

