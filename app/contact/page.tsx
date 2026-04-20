import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nicolas Sempere — photographer and filmmaker.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-28 px-6 md:px-10 min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-16 md:mb-20">
        <p className="label opacity-30 mb-4">04 / CONTACT</p>
        <h1 className="font-display font-light italic text-display-xl leading-none">
          Get in<br />touch.
        </h1>
      </div>

      {/* ── Direct contacts ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 pb-16 border-b border-[#E8E8E8]">
        <div>
          <p className="label opacity-30 mb-2">EMAIL</p>
          <a
            href="mailto:nicosmp.pro@gmail.com"
            className="font-sans text-base font-light link-bar hover:opacity-60 transition-opacity duration-300"
          >
            nicosmp.pro@gmail.com
          </a>
        </div>
        <div>
          <p className="label opacity-30 mb-2">INSTAGRAM</p>
          <a
            href="https://instagram.com/nicolas_Sempere"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-base font-light link-bar hover:opacity-60 transition-opacity duration-300"
          >
            @nicolas_Sempere
          </a>
        </div>
        <div>
          <p className="label opacity-30 mb-2">BASED IN</p>
          <p className="font-sans text-base font-light text-black/60">
            Bordeaux · Paris
          </p>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────── */}
      <div className="max-w-lg">
        <p className="label opacity-30 mb-8">OR SEND A MESSAGE</p>
        <ContactForm />
      </div>
    </div>
  );
}
