const { get } = require('../configuration/connection');
const bcrypt = require('bcrypt')
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

  doLogin:(user)=>{

    console.log("login");
    return new Promise((resolve,reject)=>{

       get().collection('user').find({mobile:user.mobile}).toArray().then((data)=>{

        if(!data.length){
          console.log('user does not exist');
          resolve('user does not exist')
        }
        else{
           console.log(data[0]);
           bcrypt.compare(user.password,data[0].password,function(err,result){

            resolve('login succeful');

           })
           
        }
       
       })

    })

  }
}