import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '923030535615';
const PREFILLED_MESSAGE = 'Assalamualaikum, I would like to know more about Fatima Online Quran Academy classes.';

export default function FloatingWhatsApp() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

  return (
    <a
      className="floating-whatsapp"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Fatima Online Quran Academy on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} strokeWidth={2.25} aria-hidden="true" />
      <span className="floating-whatsapp-label">Chat with us</span>
    </a>
  );
}
