const mongoose = require("mongoose")
const agencySchema = new mongoose.Schema({
    agencyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Agency',
        required:true
     },
     name:{
         type: String,
         required: true,
     },
     email:{
         type: String,
         required: true,
         unique:true
     },
     totalBill: {
         type:Number,
         required: true,
     },
     clientphoneNumber: {
         type: String,
         required: true,
     },
     password:{
         type:String,
         minLength: 8,
         trim: true,
         required:true,
     }

})

module.exports = mongoose.model("client",agencySchema)
