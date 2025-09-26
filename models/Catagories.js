import mongoose from 'mongoose'
const CatagoriesSchema = new mongoose.Schema({
    name: { type: String, required: true,},
    image:{type:String,required:true,},
    cat:{type: String, required: true,},
    subCat:{type: String, required: true,},
});

export default mongoose.models.Catagories || mongoose.model('Catagories', CatagoriesSchema);
