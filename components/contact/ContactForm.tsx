"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FieldProps {
  name: string;
  label: string;
  type?: "text" | "email";
  placeholder?: string;
  required?: boolean;
  delay?: number;
}

// Single text input — the bottom border draws under the label on focus
// (left → right) instead of just changing colour, matching the Ouvrir /
// Écrivez-moi pill underline vocabulary.
function Field({ name, label, type = "text", placeholder, required, delay = 0 }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: SOFT }}
      className="flex flex-col gap-2.5"
    >
      <label className="label text-white" style={{ opacity: focused ? 0.85 : 0.55, transition: "opacity 0.3s" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pb-3 bg-transparent outline-none text-sm text-white font-light placeholder:text-white/18"
          style={{ letterSpacing: "0.02em" }}
        />
        {/* Static rule */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-0 h-px bg-white/12"
        />
        {/* Animated focus rule — draws from the left */}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-0 h-px bg-white origin-left"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 0.7 : 0 }}
          transition={{ duration: 0.4, ease: SOFT }}
        />
      </div>
    </motion.div>
  );
}

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeFocused, setTypeFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      type: data.get("type"),
      message: data.get("message"),
      website: data.get("website"), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Envoi impossible");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT }}
          className="flex flex-col gap-4"
        >
          <motion.svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            initial="hidden"
            animate="visible"
          >
            <motion.path
              d="M5 17 L13 24 L27 9"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1 },
              }}
              transition={{ duration: 0.55, delay: 0.15, ease: SOFT }}
            />
          </motion.svg>
          <motion.p
            className="text-white title"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: SOFT }}
          >
            Reçu.
          </motion.p>
          <motion.p
            className="label text-white"
            style={{ opacity: 0.55 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Je vous réponds sous 24h.
          </motion.p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          noValidate
        >
          {/* Honeypot — hidden from humans, filled by bots */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Ne pas remplir
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Field name="name" label="Nom" type="text" placeholder="Votre nom" required delay={0.05} />
          <Field name="email" label="Email" type="email" placeholder="vous@email.com" required delay={0.1} />

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: SOFT }}
            className="flex flex-col gap-2.5"
          >
            <label className="label text-white" style={{ opacity: typeFocused ? 0.85 : 0.55, transition: "opacity 0.3s" }}>
              Type de projet
            </label>
            <div className="relative">
              <select
                name="type"
                onFocus={() => setTypeFocused(true)}
                onBlur={() => setTypeFocused(false)}
                className="w-full pb-3 bg-transparent outline-none text-sm text-white/55 font-light appearance-none"
              >
                <option value="" className="bg-black">Sélectionner…</option>
                {["Éditorial", "Commercial", "Film / Vidéo", "Personnel", "Autre"].map((v) => (
                  <option key={v} value={v} className="bg-black">{v}</option>
                ))}
              </select>
              <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-px bg-white/12" />
              <motion.span
                aria-hidden="true"
                className="absolute left-0 right-0 bottom-0 h-px bg-white origin-left"
                initial={false}
                animate={{ scaleX: typeFocused ? 1 : 0, opacity: typeFocused ? 0.7 : 0 }}
                transition={{ duration: 0.4, ease: SOFT }}
              />
              {/* Custom chevron — appears since we strip the native appearance */}
              <span
                aria-hidden="true"
                className="absolute right-1 bottom-3.5 text-white/45"
                style={{ fontSize: 10, letterSpacing: "0.18em" }}
              >
                ▾
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: SOFT }}
            className="flex flex-col gap-2.5"
          >
            <label className="label text-white" style={{ opacity: messageFocused ? 0.85 : 0.55, transition: "opacity 0.3s" }}>
              Message
            </label>
            <div className="relative">
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Budget. Date. Référence. Le reste, on verra."
                onFocus={() => setMessageFocused(true)}
                onBlur={() => setMessageFocused(false)}
                className="w-full pb-3 bg-transparent outline-none text-sm text-white font-light placeholder:text-white/18 resize-none"
                style={{ letterSpacing: "0.02em" }}
              />
              <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-px bg-white/12" />
              <motion.span
                aria-hidden="true"
                className="absolute left-0 right-0 bottom-0 h-px bg-white origin-left"
                initial={false}
                animate={{ scaleX: messageFocused ? 1 : 0, opacity: messageFocused ? 0.7 : 0 }}
                transition={{ duration: 0.4, ease: SOFT }}
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 0.85, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: SOFT }}
                className="label"
                style={{ color: "#ff8080" }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: SOFT }}
            whileHover={loading ? undefined : "hover"}
            whileTap={loading ? undefined : "tap"}
            variants={{
              hover: { x: 0 },
              tap: { scale: 0.98 },
            }}
            className="group self-start label text-white flex items-center gap-5 disabled:opacity-25 mt-2"
            style={{ opacity: 0.85 }}
          >
            <span className="relative inline-block">
              {loading ? "Envoi…" : "Envoyer"}
              <motion.span
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-1 h-px bg-white origin-left"
                variants={{
                  hover: { scaleX: 1, opacity: 0.7 },
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: SOFT }}
              />
            </span>
            <motion.span
              aria-hidden="true"
              className="block w-8 h-px bg-white"
              variants={{
                hover: { width: 56 },
              }}
              initial={{ width: 32 }}
              transition={{ duration: 0.4, ease: SOFT }}
            />
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
