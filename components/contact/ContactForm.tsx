"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate — wire up to Resend/Formspree when ready
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="py-4"
        >
          <p className="font-display italic font-light text-3xl md:text-4xl">
            Message sent.
          </p>
          <p className="label opacity-30 mt-3">I&apos;ll be in touch shortly.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Name */}
          <div className="group flex flex-col gap-2">
            <label className="label opacity-30">NAME</label>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              className="w-full border-b border-black/15 pb-2.5 bg-transparent outline-none font-sans text-sm font-light text-black placeholder:text-black/25 focus:border-black transition-colors duration-300"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="label opacity-30">EMAIL</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              className="w-full border-b border-black/15 pb-2.5 bg-transparent outline-none font-sans text-sm font-light text-black placeholder:text-black/25 focus:border-black transition-colors duration-300"
            />
          </div>

          {/* Project type */}
          <div className="flex flex-col gap-2">
            <label className="label opacity-30">TYPE OF PROJECT</label>
            <select
              name="project_type"
              className="w-full border-b border-black/15 pb-2.5 bg-transparent outline-none font-sans text-sm font-light text-black/70 focus:border-black transition-colors duration-300 appearance-none"
            >
              <option value="">Select...</option>
              <option>Editorial</option>
              <option>Commercial</option>
              <option>Film / Video</option>
              <option>Personal project</option>
              <option>Other</option>
            </select>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="label opacity-30">MESSAGE</label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Tell me about your project..."
              className="w-full border-b border-black/15 pb-2.5 bg-transparent outline-none font-sans text-sm font-light text-black placeholder:text-black/25 focus:border-black transition-colors duration-300 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="self-start label flex items-center gap-4 hover:opacity-50 transition-opacity duration-300 disabled:opacity-40"
          >
            {loading ? "SENDING" : "SEND"}
            <motion.span
              className="block h-px bg-black"
              animate={{ width: loading ? 48 : 32 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
