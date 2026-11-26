'use client';
import {useEffect, useState} from 'react';
const currencies = {PKR:'Pakistani Rupees',USD:'US Dollars',GBP:'British Pounds',CAD:'Canadian Dollars',AED:'UAE Dirhams',SAR:'Saudi Riyals',AUD:'Australian Dollars',EUR:'Euros'};
export default function CurrencyPreferenceNotice() {
 const [value,setValue]=useState('PKR');
 useEffect(()=>{
  try{const saved=window.localStorage.getItem('fatima-currency'); if(currencies[saved])setValue(saved)}catch(_){}
  function onChange(event){if(currencies[event.detail])setValue(event.detail)}
  window.addEventListener('fatima:currency-change',onChange);
  return ()=>window.removeEventListener('fatima:currency-change',onChange);
 },[]);
 return <p className="ref-fee-currency" role="status">Your selected quote currency: <strong>{value}</strong> ({currencies[value]}). Class fees are confirmed individually by the academy; this selector does not calculate exchange rates.</p>;
}
