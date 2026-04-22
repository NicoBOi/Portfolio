"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
          transition={{ duration: 0.5, ease: SOFT }}
          className="flex flex-col gap-3"
        >
          <p
            className="text-white title"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Reçu.
          </p>
          <p className="label text-white" style={{ opacity: 0.3 }}>Je te réponds sous 24h.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {[
            { name: "name", label: "Nom", type: "text", placeholder: "Ton nom" },
            { name: "email", label: "Email", type: "email", placeholder: "ton@email.com" },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name} className="flex flex-col gap-2.5">
              <label className="label text-white" style={{ opacity: 0.28 }}>{label}</label>
              <input
                type={type}
                name={name}
                required
                placeholder={placeholder}
                className="w-full border-b border-white/12 pb-3 bg-transparent outline-none text-sm text-white font-light placeholder:text-white/18 focus:border-white/40 transition-colors duration-300"
                style={{ letterSpacing: "0.02em" }}
              />
            </div>
          ))}

          <div className="flex flex-col gap-2.5">
            <label className="label text-white" style={{ opacity: 0.28 }}>Type de projet</label>
            <select
              name="type"
              className="w-full border-b border-white/12 pb-3 bg-transparent outline-none text-sm text-white/50 font-light focus:border-white/40 transition-colors duration-300 appearance-none"
            >
              <option value="" className="bg-black">Sélectionner…</option>
              {["Éditorial", "Commercial", "Film / Vidéo", "Personnel", "Autre"].map((v) => (
                <option key={v} value={v} className="bg-black">{v}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="label text-white" style={{ opacity: 0.28 }}>Message</label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Budget. Date. Référence. Le reste, on verra."
              className="w-full border-b border-white/12 pb-3 bg-transparent outline-none text-sm text-white font-light placeholder:text-white/18 focus:border-white/40 transition-colors duration-300 resize-none"
              style={{ letterSpacing: "0.02em" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="self-start label text-white hover:opacity-100 transition-opacity duration-300 flex items-center gap-5 disabled:opacity-25 mt-2"
            style={{ opacity: 0.55 }}
          >
            {loading ? "Envoi…" : "Envoyer"}
            <span className="block w-8 h-px bg-white" />
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
