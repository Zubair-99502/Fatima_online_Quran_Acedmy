import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import ScrollAnimations from './ScrollAnimations';

export default function SiteLayout({children}) {
  return <>
    <Header/>
    <ScrollAnimations/>
    {children}
    <Footer/>
    <FloatingWhatsApp/>
  </>;
}
