const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = new Schema({
    email :{
        type : String,
        //required : true,
    },
    username :{
        type : String,
        //required : true,
    },
    password :{
        type : String,
        //required : true,
    },
    address :{
        type : String,
        //required :true,
    },
    phoneNo :{
        type : String,
        //required : true
    },
    role:{
        type : String,
        enum : ['Admin' ,'user'],
        default :'user'
    },
    cart:{
        items :[
            {
                productId :{
                    type : Schema.Types.ObjectId,
                    ref : 'Product',
                    //required : true,
                },
                quantity :{type : Number, required : true}
            }
        ]   
    }
})

UserModel.methods.addtoCart =function(product){
    const cartProductIndex =this.cart.items.findIndex(cp =>{
        return cp.productId.toString() === product._id.toString()
    })
    let newQuantity =  1;
    let updateCartItem = [...this.cart.items];
    if(cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity +1;
        updateCartItem[cartProductIndex].quantity =newQuantity;
    }else{
        updateCartItem.push({
            productId : product._id,
            quantity : newQuantity,
        })
    }
    const updateCart ={
        items : updateCartItem,
    }
    this.cart = updateCart;
    return this.save()
}

UserModel.methods.removeCart = function(productId){
    const updateCartItems = this.cart.items.filter(item=>{
        item.productId.toString() !== productId.toString()
    })
    this.cart.items = updateCartItems;
    return this.save();
}

UserModel.methods.decCartQuantity = function(productID){
    const updateCartItem = this.cart.items.findIndex(cp =>{
        return cp.productId.toString() === productID.toString()
    })
    if(updateCartItem >= 0){
        let newQuantity = this.cart.items[updateCartItem].quantity -1 ;
        if(newQuantity <= 0){
            this.cart.items.splice(updateCartItem,1)
            }else{
                this.cart.items[updateCartItem].quantity = newQuantity;
                }
                return this.save();
}//not using in the controller
}



module.exports=mongoose.model('User',UserModel);

