const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const GallerySchema=new Schema({
    image: Buffer,
    // date:Date,
    description:String,
});

module.exports=mongoose.model('Gallery',GallerySchema);

