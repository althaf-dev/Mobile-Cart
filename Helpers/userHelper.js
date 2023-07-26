const { get } = require('../configuration/connection');
const bcrypt = require('bcrypt');
var objectM = require('mongodb').ObjectId
module.exports = {

  getProducts: () => {

    return new Promise(async (resolve, reject) => {

      let product = await get().collection('test').find({}).toArray();
      if (product) {
        resolve(product);
      }
      else {
        reject("Product collection is Empty");
      }

    })
  },
  doSignup: (user) => {



    return new Promise((resolve, reject) => {



      bcrypt.hash(user.password, 10, function (err, hash) {

        user.password = hash;
        console.log(hash);
        get().collection('user').insertOne(user).then(() => {

          resolve("success");
        })
      })



    })


  },

  doLogin: (user) => {

    console.log("login");

    return new Promise((resolve, reject) => {

      get().collection('user').find({ mobile: user.mobile }).toArray().then((data) => {

        if (!data.length) {
          console.log('user does not exist');
          resolve('user does not exist')
        }
        else {
          console.log(data[0]);
          bcrypt.compare(user.password, data[0].password, function (err, result) {

            resolve('login succeful');

          })

        }

      })

    })

  },

  addProductsToCart: (id, user) => {



    return new Promise(async (resolve, reject) => {

      console.log("searching for cart")
      let prodId = objectM.createFromHexString(id);
      console.log(`proid = ${prodId}`);
      let cart = await get().collection('cart').find({ user: user }).toArray();
      if (!cart.length) {
        console.log('cart not exist')
        get().collection('cart').insertOne({ user: user, products: [{ item_id: id, qty: 1 }] }).then(() => {

          resolve('product added');
        })
      }
      else {

        let proIndex = cart[0].products.findIndex((product) => product.item_id == id);
        console.log(proIndex);
        if (proIndex === -1) {
          get().collection('cart').updateOne({ user: user }, { $push: { products: { item_id: prodId, qty: 1 } } })
        }
        else {
          console.log("incrimenting")
          get().collection('cart').updateOne({ 'products.item_id': prodId }, { $inc: { 'products.$.qty': 1 } })
        }
        // console.log(cart);
        console.log('cart exist')
      }



    })



  },
    getTotalProduct:(user)=>{

        console.log("total qty");
       return new Promise(async(resolve,reject)=>{

        let total = await get().collection('cart').aggregate([ 
          
          
          {$match:{user:user}},
          {$unwind:'$products'},
          {$project:{'products.qty':1}},
          {$group:{_id:null,totalqty:{$sum:'$products.qty'}}}
          ]
          
          
         
          
          ).toArray();
          console.log(total[0].totalqty);
          resolve(total[0].totalqty);
       })
}

}