const {get} = require('../configuration/connection');
module.exports={

    addProduct:(data)=>{

        data.product_price = Number(data.product_price);
        return new Promise((resolve,reject)=>{

            get().collection('test').insertOne(data).then((data)=>{

      
                resolve(data.insertedId.toString());
            })

        })
            

    },
    getProducts:()=>{

        return new Promise ((resolve,reject)=>{

            let products = get().collection('test').find({}).toArray();
            resolve(products);
        })

    },
    getProductNames:()=>{

        return new Promise (async(resolve,reject)=>{

            let products = await get().collection('test').aggregate([
                {$match:{}},
                {$project:{'product_name':1,"_id":0}}
            ]).toArray();
            resolve(products);
        })

    },


    getOrders:()=>{

        return new Promise((resolve,reject)=>{

          let orders  =  get().collection('order').find({}).toArray();
          resolve(orders);
        })
    }






}