const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const anouncementSchema=new Schema({
    send_date: Date,
    from:String,
    to:String,
    message: String
});

module.exports=mongoose.model('anounce',anouncementSchema);