const MongoClient = require("mongodb").MongoClient;
const URL = 'mongodb://127.0.0.1:27017'
const dbName = 'MobileShop'
state={
    db:null
}

module.exports.connect = function (){
    
const client = new MongoClient(URL);
client.connect("shopping").then((data)=>{
    console.log("connected");
    state.db = data.db(dbName);
    // console.log(data.db("test"));
})

}


module.exports.get=function (){
    return state.db;
}