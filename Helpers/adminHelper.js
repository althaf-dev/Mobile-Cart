const {get} = require('../configuration/connection');
module.exports={

    addProduct:(data)=>{

        data.product_price = Number(data.product_price);
        return new Promise((resolve,reject)=>{

            get().collection('test').insertOne(data).then((data)=>{

      
                resolve(data.insertedId.toString());
            })

        })
            

    }






}