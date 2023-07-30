
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
  userHelper.getProducts().then((products)=>{

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

  
  console.log(req.body)
  userHelper.doLogin(req.body).then((data)=>{

    // console.log(data);
    req.session.logedin=true;
    req.session.user=req.body.mobile;
    res.redirect('/');
  })
})

router.post('/addProductsToCart',verifiedLogin, (req,res,next)=>{

  console.log(req.body);
  console.log(req.session.user)
  
  userHelper.addProductsToCart(req.body.id,req.session.user).then(()=>{
    res.json({status:true,user:req.session.user})
  })

})
router.get('/getTotalProduct',verifiedLogin,async(req,res)=>{

  // console.log("call to get total")
  let count = await userHelper.getTotalProduct(req.session.user);
  // console.log(count);
  res.json({totalQty:count});
})

router.get("/cart",verifiedLogin,async (req,res)=>{

  let Total = await userHelper.getTotalPrice(req.session.user);
  
  // console.log("tot");
  //  console.log(Total);
  // console.log(total);
  userHelper.getCartProducts(req.session.user).then((cart)=>{

    res.render('User/Cart',{cart,Total});
  });
  
})

router.post('/cartQuantityUpdate',verifiedLogin, (req,res,next)=>{

  // console.log(req.body);
  // console.log(req.session.user)
  console.log("called-done");
  
  userHelper.addProductsToCart(req.body.id,req.session.user,req.body.value).then(async()=>{
    console.log("done");
    let Total = await userHelper.getTotalPrice(req.session.user);
    setTimeout(()=>{
        userHelper.getCartProducts(req.session.user).then((cart)=>{

              res.json({status:true,user:req.session.user,cart,Total})
            });
    },2000)
   
    
    
  })

})

router.get('/checkout',async(req,res)=>{

  let Total = await userHelper.getTotalPrice(req.session.user);
  res.render('User/Checkout',{Total});
})

router.post('/placeorder',(req,res)=>{

  console.log("placeorder");
  console.log(req.body);
  userHelper.placeOrder(req.session.user,req.body).then(()=>{

      res.render('User/PlaceOrder')

  })
})
module.exports = router;

