import {NextResponse} from 'next/server';
import {plans,stripeReady} from '../../../../lib/stripe';
export async function GET(){return NextResponse.json({enabled:stripeReady(),plans:plans.map(({id,name})=>({id,name}))},{headers:{'Cache-Control':'no-store'}});}
