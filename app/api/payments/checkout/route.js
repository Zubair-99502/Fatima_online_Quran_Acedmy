import {NextResponse} from 'next/server';
import {plans,stripeReady,stripeRequest} from '../../../../lib/stripe';
export async function POST(request){try{
 if(!stripeReady())return NextResponse.json({error:'Online checkout is not yet configured. Please contact the academy.'},{status:503});
 const body=await request.json();const plan=plans.find(p=>p.id===body.plan);const email=String(body.email||'').trim().toLowerCase();
 if(!plan||!/^\S+@\S+\.\S+$/.test(email)||email.length>254)return NextResponse.json({error:'Select a valid plan and enter a valid email.'},{status:400});
 const origin=process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/,'')||new URL(request.url).origin;
 const session=await stripeRequest('checkout/sessions',{'mode':'payment','line_items[0][price]':plan.priceId,'line_items[0][quantity]':'1','customer_email':email,'success_url':origin+'/payment/success?session_id={CHECKOUT_SESSION_ID}','cancel_url':origin+'/payment/cancel','client_reference_id':plan.id,'metadata[academy]':'Fatima Online Quran Academy'});
 return NextResponse.json({url:session.url});
 }catch(error){console.error('Checkout error:',error);return NextResponse.json({error:'Unable to start secure checkout.'},{status:500});}}
