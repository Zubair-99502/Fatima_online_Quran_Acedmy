const pages=['','/courses','/teachers','/testimonials','/pricing','/about','/blog','/contact','/free-trial'];
export default function sitemap(){
 const origin=(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000').replace(/\/$/,'');
 return pages.map(path=>({url:origin+path,lastModified:new Date(),changeFrequency:path?'monthly':'weekly',priority:path?0.7:1}));
}
