const mongoose = require("mongoose")
//const Client = require('Client')
const agencySchema = new mongoose.Schema({

name:{
   type:String,
   required:true,
},
address1:{
    type:String,
    required:true,   
},
Address2:{
    type:String,
},
state:{
    type:String,
    required:true,
},
city:{
    type:String,
    required:true,
},
phoneNumber:{
    type:Number,
    required:true,  
},
clientId:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Client',
    }]
})

module.exports = mongoose.model("agency",agencySchema)


