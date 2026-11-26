import mongoose from 'mongoose';
const PaymentSchema = new mongoose.Schema({sessionId:{type:String,unique:true,required:true},customerEmail:{type:String,default:''},planName:{type:String,default:''},amountTotal:{type:Number,default:0},currency:{type:String,default:'usd'},status:{type:String,enum:['pending','paid','failed','refunded'],default:'pending'},paymentIntent:{type:String,default:''}},{timestamps:true});
export default mongoose.models.Payment || mongoose.model('Payment',PaymentSchema);
