export default function Footer() {
  return (
    <footer className="border-t border-white/10 h-12 px-6 md:px-10 flex items-center justify-between bg-black">
      <span className="label text-white" style={{ opacity: 0.2 }}>
        &copy; 2025 Nicolas Sempere
      </span>
      <div className="flex items-center gap-6">
        <a
          href="https://instagram.com/nicolas_Sempere"
          target="_blank"
          rel="noopener noreferrer"
          className="label text-white hover:opacity-100 transition-opacity duration-300"
          style={{ opacity: 0.2 }}
        >
          Instagram
        </a>
        <a
          href="mailto:nicosmp.pro@gmail.com"
          className="label text-white hover:opacity-100 transition-opacity duration-300"
          style={{ opacity: 0.2 }}
        >
          Email
        </a>
      </div>
    </footer>
  );
}
