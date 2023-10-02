const { get } = require('../configuration/connection');
const bcrypt = require('bcrypt');
var objectM = require('mongodb').ObjectId
module.exports = {

  getProducts: (category, min = 0, max = 10000) => {


    return new Promise(async (resolve, reject) => {
      let product;
      if (category != 'all') {
        unfilteredProduct = await get().collection('test').find({ 'product_brand': category.toLowerCase() }).toArray();
        product = unfilteredProduct.filter(prod => prod.product_price >= min && prod.product_price <= max);
      }
      else {
        product = await get().collection('test').find({}).toArray();
      }

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

  addProductsToCart: (id, user, value = 1) => {
    return new Promise(async (resolve, reject) => {
      let prodId = objectM.createFromHexString(id);
      let cart = await get().collection('cart').find({ user: user }).toArray();
      if (!cart.length) {
        console.log('cart not exist')
        get().collection('cart').insertOne({ user: user, products: [{ item_id: prodId, qty: 1,Ss:"Pending",Ds:"Pending" }] }).then(() => {
          resolve('product added');
        })
      }
      else {

        let proIndex = cart[0].products.findIndex((product) => product.item_id == id);
        console.log(proIndex);
        if (proIndex === -1) {
          get().collection('cart').updateOne({ user: user }, { $push: { products: { item_id: prodId, qty: 1,Ss:"Pending",Ds:"Pending" } } })
        }
        else {
          console.log("incrimenting")
          get().collection('cart').updateOne({ 'products.item_id': prodId }, { $inc: { 'products.$.qty': Number(value) } })
        }
        console.log('cart exist');
        resolve();
      }
    })
  },
  getTotalProduct: (user) => {

    console.log("total qty");
    return new Promise(async (resolve, reject) => {

      let total = await get().collection('cart').aggregate([
        { $match: { user: user } },
        { $unwind: '$products' },
        { $project: { 'products.qty': 1 } },
        { $group: { _id: null, totalqty: { $sum: '$products.qty' } } }
      ]).toArray();
      console.log(total[0].totalqty);
      resolve(total[0].totalqty);
    })
  },

  getCartProducts: (user) => {
    return new Promise(async (resolve, reject) => {
      let cart = await get().collection('cart').aggregate([
        { $match: { user: user } },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'test',
            localField: 'products.item_id',
            foreignField: "_id",
            as: 'pro'
          }
        },
        { $unwind: '$pro' },
        { $project: { 'pro.product_price': 1, 'pro.product_name': 1, 'products.qty': 1, 'products.item_id': 1, 'total': { $multiply: ['$products.qty', '$pro.product_price'] } } }
      ]).toArray();
      if (cart) {
        resolve(cart);
      }

    })
  },
  removeCartItem : (user,id)=>{

      return new Promise(async(resolve,reject)=>{

        let cart = await get().collection('cart').findOne({'user':user});
        let prodId = objectM.createFromHexString(id);
        let index = cart.products.findIndex(product=>product.item_id==id);
        console.log(`index=${index}`);
        if(index!=-1){
          get().collection('cart').updateOne({'user':user},{$pull:{products:{item_id:prodId}}}).then((data)=>{
              resolve(data);
          })
        }

      })
  },
  getTotalPrice: (user) => {
    return new Promise(async (resolve, reject) => {
      let cart = await get().collection('cart').aggregate([
        { $match: { user: user } },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'test',
            localField: 'products.item_id',
            foreignField: "_id",
            as: 'pro'
          }
        },
        { $unwind: '$pro' },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ['$products.qty', '$pro.product_price'] } }
          }
        }
      ]).toArray();
      if (cart) {
        // console.log(`cart=${cart[0]}`);
        resolve(cart[0].total);
      }
    })
  },

  placeOrder: function (user, data) {
    return new Promise(async (resolve, reject) => {
      let cart = await get().collection('cart').aggregate([
        { $match: { user: user } }
      ]).toArray();
      data.products = cart[0].products;
      get().collection('order').insertOne(data).then(() => {
        resolve('true');
      })
    })
  },
  findProduct: (proName) => {

    return new Promise((resolve, reject) => {

      let product = get().collection('test').findOne({ product_name: proName })
      resolve(product);
    })
  },
  getOrders:(user)=>{
    return new Promise(async(resolve,reject)=>{
      let orders = await get().collection('order').aggregate([
        { $match: { 'mobileNumber':user } },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'test',
            localField: 'products.item_id',
            foreignField: "_id",
            as: 'pro'
          }
        }
      
      ]).toArray();
      console.log(orders);
      if (orders) {
        resolve(orders);
      }
    })
}
}