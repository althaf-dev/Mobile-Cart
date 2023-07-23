const {get} = require('../configuration/connection');
module.exports={

    addProduct:(data)=>{

        return new Promise((resolve,reject)=>{

            get().collection('test').insertOne(data).then((data)=>{

      
                resolve(data.insertedId.toString());
            })

        })
            

    }






}