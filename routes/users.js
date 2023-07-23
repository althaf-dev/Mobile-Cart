
var express = require('express');
var router = express.Router();
var userHelper = require('../Helpers/userHelper');

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
router.get('/login',(req,res)=>{

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
    req.session.user=req.body;
    res.redirect('/');
  })
})

module.exports = router;
