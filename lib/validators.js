export function clean(value,max=300){ return String(value ?? '').trim().slice(0,max); }
export function validEmail(value){ return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
