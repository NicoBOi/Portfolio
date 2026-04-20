import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-start justify-center px-6 md:px-10">
      <p className="label opacity-25 mb-6">404</p>
      <h1 className="font-display font-light italic text-display-xl text-black/10 leading-none mb-10">
        Not found.
      </h1>
      <Link
        href="/"
        className="label flex items-center gap-4 hover:opacity-50 transition-opacity duration-300"
      >
        <span className="w-8 h-px bg-black" />
        RETURN HOME
      </Link>
    </div>
  );
}
