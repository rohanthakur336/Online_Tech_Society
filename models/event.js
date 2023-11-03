const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const eventschema=new Schema({
    start_date: Date,
    end_date:Date,
    img: Buffer,
    img_type:String,
    description: String,
    venue: String
});

module.exports=mongoose.model('event',eventschema);