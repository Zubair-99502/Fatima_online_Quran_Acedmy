import mongoose from 'mongoose';
const TeacherSchema = new mongoose.Schema({ name:{type:String,required:true}, title:{type:String,default:'Quran Teacher'}, gender:{type:String,default:'Not specified'}, qualifications:{type:String,default:''}, courses:{type:[String],default:[]}, availability:{type:String,default:'Contact for availability'}, active:{type:Boolean,default:true} },{timestamps:true});
export default mongoose.models.Teacher || mongoose.model('Teacher',TeacherSchema);
