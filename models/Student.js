import mongoose from 'mongoose';
const StudentSchema = new mongoose.Schema({ name:{type:String,required:true}, parentName:{type:String,default:''}, country:{type:String,default:''}, course:{type:String,default:''}, teacher:{type:String,default:''}, schedule:{type:String,default:''}, status:{type:String,enum:['Active','Paused','Completed'],default:'Active'}, notes:{type:String,default:''} },{timestamps:true});
export default mongoose.models.Student || mongoose.model('Student',StudentSchema);
