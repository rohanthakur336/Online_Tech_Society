const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const loginSchema=new Schema({
    username:String,
    password:String,
    role:String
});

module.exports=mongoose.model('login',loginSchema);