import {NextResponse} from 'next/server';export async function POST(){const r=NextResponse.json({success:true});r.cookies.set('fatima_admin','',{httpOnly:true,path:'/',maxAge:0});return r;}
