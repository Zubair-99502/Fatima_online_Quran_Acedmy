import {NextResponse} from 'next/server';
import {connectDB} from '../../../../lib/db';
import {requireAdmin} from '../../../../lib/auth';
import Payment from '../../../../models/Payment';
export async function GET(request){if(!await requireAdmin(request))return NextResponse.json({error:'Unauthorized'},{status:401});try{await connectDB();const items=await Payment.find().sort({createdAt:-1}).limit(300).lean();return NextResponse.json({items:items.map(item=>({...item,_id:String(item._id)}))},{headers:{'Cache-Control':'no-store'}})}catch(error){console.error('Payments query failed:',error);return NextResponse.json({error:'Unable to load payments'},{status:500})}}
