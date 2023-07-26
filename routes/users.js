
var express = require('express');
var router = express.Router();
var userHelper = require('../Helpers/userHelper');



const verifiedLogin = function(req,res,next){

  console.log('verification');
  console.log(req.session.user)
  if(req.session.user){
    console.log("next")
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

    console.log(data);
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

  console.log("call to get total")
  let count = await userHelper.getTotalProduct(req.session.user);
  console.log(count);
  res.json({totalQty:count});
})
module.exports = router;
