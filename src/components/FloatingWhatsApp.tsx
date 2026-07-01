import { MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/lib/site-data";

export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-xl animate-pulse-ring hover:scale-105 transition"
    >
      <MessageCircle size={26} fill="white" stroke="none" />
    </a>
  );
}
