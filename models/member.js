const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const memberschema=new Schema({
    img: String,
    name:String,
    designation:String,
    description: String
});

module.exports=mongoose.model('member',memberschema);