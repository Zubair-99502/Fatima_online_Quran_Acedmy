import {NextResponse} from 'next/server';
import {createHmac,timingSafeEqual} from 'node:crypto';
import {connectDB} from '../../../../lib/db';
import Payment from '../../../../models/Payment';
import {plans} from '../../../../lib/stripe';
export const runtime='nodejs';
export async function POST(request){
 const secret=process.env.STRIPE_WEBHOOK_SECRET;if(!secret)return NextResponse.json({error:'Webhook not configured'},{status:503});
 const signature=request.headers.get('stripe-signature')||'';const raw=await request.text();
 const timestamp=signature.split(',').find(p=>p.startsWith('t='))?.slice(2);const checks=signature.split(',').filter(p=>p.startsWith('v1=')).map(p=>p.slice(3));
 if(!timestamp||Math.abs(Date.now()/1000-Number(timestamp))>300||!checks.length)return NextResponse.json({error:'Invalid signature'},{status:400});
 const digest=createHmac('sha256',secret).update(timestamp+'.'+raw).digest('hex');const expected=Buffer.from(digest,'utf8');
 if(!checks.some(sig=>{const buf=Buffer.from(sig,'utf8');return buf.length===expected.length&&timingSafeEqual(buf,expected)}))return NextResponse.json({error:'Invalid signature'},{status:400});
 try{const event=JSON.parse(raw);const session=event.data?.object;
 if(['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed'].includes(event.type)&&session?.id?.startsWith('cs_')){
 const paid=event.type!=='checkout.session.async_payment_failed'&&session.payment_status==='paid';
 await connectDB();await Payment.findOneAndUpdate({sessionId:session.id},{$set:{customerEmail:session.customer_details?.email||session.customer_email||'',planName:plans.find(p=>p.id===session.client_reference_id)?.name||session.client_reference_id||'Academy fee',amountTotal:Number(session.amount_total)||0,currency:String(session.currency||'usd'),status:paid?'paid':event.type==='checkout.session.async_payment_failed'?'failed':'pending',paymentIntent:session.payment_intent||''}},{upsert:true,new:true,setDefaultsOnInsert:true});
 }
 return NextResponse.json({received:true});
 }catch(error){console.error('Webhook processing failed:',error);return NextResponse.json({error:'Unable to process webhook'},{status:500});}
}
