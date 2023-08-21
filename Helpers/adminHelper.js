const { get } = require('../configuration/connection');
var objectM = require('mongodb').ObjectId
module.exports = {
    addProduct: (data) => {
        data.product_price = Number(data.product_price);
        return new Promise((resolve, reject) => {
            get().collection('test').insertOne(data).then((data) => {
                resolve(data.insertedId.toString());
            })
        })
    },
    updateProduct: (id, data) => {
        data.product_price = Number(data.product_price);
        let prodId = objectM.createFromHexString(id);
        return new Promise((resolve, reject) => {
            get().collection('test').updateOne({ _id: prodId }, {
                $set: {
                    product_name: data.product_name, product_price: data.product_price, product_brand: data.product_brand,
                    product_stkqty: data.product_stkqty
                }
            }).then(() => {
                resolve("updated");
            })
        })
    },
    getProducts: () => {
        return new Promise((resolve, reject) => {
            let products = get().collection('test').find({}).toArray();
            resolve(products);
        })
    },
    getProductNames: () => {
        return new Promise(async (resolve, reject) => {
            let products = await get().collection('test').aggregate([
                { $match: {} },
                { $project: { 'product_name': 1, "_id": 0 } }
            ]).toArray();
            resolve(products);
        })
    },
    getOrders: () => {
        return new Promise((resolve, reject) => {
            let orders = get().collection('order').find({}).toArray();
            resolve(orders);
        })
    },
    getProductsFromOrder: (orderId) => {
        let order_Id = objectM.createFromHexString(orderId);
        return new Promise((resolve, reject) => {

            let products = get().collection('order').aggregate([
                { $match: { _id: order_Id } },
                {
                    $lookup: {
                        from: 'test',
                        localField: 'products.item_id',
                        foreignField: "_id",
                        as: 'pro'
                    }
                }


            ]).toArray();
            resolve(products);
        })
    },
    updateOrderProductStatus: (orderId, proId, status) => {

        let order_Id = objectM.createFromHexString(orderId);
        let pro_Id = objectM.createFromHexString(proId);
        return new Promise(async (resolve, reject) => {

            await get().collection('order').updateOne(
                { _id: order_Id, 'products.item_id': pro_Id },
                {
                    $set: { 'products.$.Ss': status }
                }
            )
        });
        resolve("done");
    },
    productWrapper: (order) => {

        let product_details = order[0].pro;
        let order_details = order[0].products;
        // console.log(product_details);
        // console.log(order_details)
        let result = [];
        for (let i = 0; i < product_details.length; i++) {
            let j = order_details.findIndex(prod =>prod.item_id.toString() == product_details[i]._id.toString())
            console.log(j);
            result.push({ ...product_details[i], ...order_details[j] })
        }
        return result;
    }
}