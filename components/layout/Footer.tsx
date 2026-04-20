export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E8E8E8] h-12 px-6 md:px-10 flex items-center justify-between">
      <span className="label opacity-30">
        © {year} NICOLAS SEMPERE
      </span>
      <div className="flex items-center gap-8">
        <a
          href="https://instagram.com/nicolas_Sempere"
          target="_blank"
          rel="noopener noreferrer"
          className="label opacity-30 hover:opacity-100 transition-opacity duration-300"
        >
          INSTAGRAM
        </a>
        <a
          href="mailto:nicosmp.pro@gmail.com"
          className="label opacity-30 hover:opacity-100 transition-opacity duration-300"
        >
          EMAIL
        </a>
      </div>
    </footer>
  );
}
