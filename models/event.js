const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const eventschema=new Schema({
    date: Date,
    img: String,
    description: String,
    venue: String
});

module.exports=mongoose.model('event',eventschema);