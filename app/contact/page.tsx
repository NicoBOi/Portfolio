import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen pt-28 pb-28 px-5 md:px-8 flex flex-col">
      {/* Header */}
      <div className="mb-14 md:mb-20">
        <p className="label text-white opacity-25 mb-4">[04] Contact</p>
        <h1 className="text-display text-white">
          Talk<br />to me.
        </h1>
      </div>

      {/* Direct */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14 pb-14 border-b border-white/10">
        <div>
          <p className="label text-white opacity-25 mb-2">Email</p>
          <a
            href="mailto:nicosmp.pro@gmail.com"
            className="font-mono text-sm text-white/60 hover:text-white transition-colors duration-300"
          >
            nicosmp.pro@gmail.com
          </a>
        </div>
        <div>
          <p className="label text-white opacity-25 mb-2">Instagram</p>
          <a
            href="https://instagram.com/nicolas_Sempere"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-white/60 hover:text-white transition-colors duration-300"
          >
            @nicolas_Sempere
          </a>
        </div>
        <div>
          <p className="label text-white opacity-25 mb-2">Location</p>
          <p className="font-mono text-sm text-white/40">Bordeaux &mdash; Paris</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md">
        <p className="label text-white opacity-25 mb-8">Or send a message</p>
        <ContactForm />
      </div>
    </div>
  );
}
