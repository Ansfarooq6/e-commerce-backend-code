const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user:{
        email:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true,
        },
        address:{
            type : String,
            required:true,
        },
        phone :{
            type : String,
            required : true,
        },

    },

    products :[
        {
            product:{type : Object ,required: true},
            quantity :{type : Number ,  required : true}
        }
    ],
    status: {
        type: String,
        default: 'paid'
    },
    // paymentMethod: {
    //     type: String,
    //     required: true
    // },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Order', OrderSchema);