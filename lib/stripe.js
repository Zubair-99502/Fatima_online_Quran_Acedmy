export const plans = [
  {id:'starter',name:'Starter',priceId:process.env.STRIPE_PRICE_STARTER},
  {id:'standard',name:'Standard',priceId:process.env.STRIPE_PRICE_STANDARD},
  {id:'premium',name:'Premium',priceId:process.env.STRIPE_PRICE_PREMIUM},
].filter(plan=>plan.priceId && /^price_[a-zA-Z0-9]+$/.test(plan.priceId));
export function stripeReady(){return !!process.env.STRIPE_SECRET_KEY && plans.length>0;}
export async function stripeRequest(endpoint, data){
 const response=await fetch('https://api.stripe.com/v1/'+endpoint,{method:'POST',headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(data).toString(),cache:'no-store'});
 const result=await response.json();if(!response.ok)throw new Error(result?.error?.message||'Stripe request failed');return result;
}
