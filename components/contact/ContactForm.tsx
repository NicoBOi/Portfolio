"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 800);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-title text-white">Done.</p>
          <p className="label text-white opacity-30 mt-3">I&apos;ll be in touch.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[
            { name: "name", label: "Name", type: "text", placeholder: "Your name" },
            { name: "email", label: "Email", type: "email", placeholder: "your@email.com" },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name} className="flex flex-col gap-2">
              <label className="label text-white opacity-30">{label}</label>
              <input
                type={type}
                name={name}
                required
                placeholder={placeholder}
                className="w-full border-b border-white/15 pb-2.5 bg-transparent outline-none font-mono text-sm text-white placeholder:text-white/20 focus:border-white/50 transition-colors duration-300"
              />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <label className="label text-white opacity-30">Project type</label>
            <select
              name="type"
              className="w-full border-b border-white/15 pb-2.5 bg-transparent outline-none font-mono text-sm text-white/60 focus:border-white/50 transition-colors duration-300 appearance-none"
            >
              <option value="" className="bg-black">Select...</option>
              {["Editorial", "Commercial", "Film / Video", "Personal", "Other"].map((v) => (
                <option key={v} value={v} className="bg-black">{v}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="label text-white opacity-30">Message</label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Tell me about the project..."
              className="w-full border-b border-white/15 pb-2.5 bg-transparent outline-none font-mono text-sm text-white placeholder:text-white/20 focus:border-white/50 transition-colors duration-300 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="self-start label text-white opacity-60 hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 disabled:opacity-30"
          >
            {loading ? "Sending..." : "Send"}
            <span className="w-6 h-px bg-white" />
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
