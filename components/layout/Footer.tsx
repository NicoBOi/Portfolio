export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 h-7 px-6 md:px-10 flex items-center justify-between bg-black"
    >
      <span
        className="label text-white"
        style={{ opacity: 0.3, fontSize: "9px" }}
      >
        &copy; 2025 Nicolas Sempere
      </span>
      <div className="flex items-center gap-5">
        <a
          href="https://instagram.com/nicolas_Sempere"
          target="_blank"
          rel="noopener noreferrer"
          className="label text-white hover:opacity-100 transition-opacity duration-300"
          style={{ opacity: 0.3, fontSize: "9px" }}
        >
          Instagram
        </a>
        <a
          href="mailto:nicosmp.pro@gmail.com"
          className="label text-white hover:opacity-100 transition-opacity duration-300"
          style={{ opacity: 0.3, fontSize: "9px" }}
        >
          Email
        </a>
      </div>
    </footer>
  );
}
