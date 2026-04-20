import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen flex flex-col items-start justify-center px-5 md:px-8">
      <p className="label text-white opacity-20 mb-4">[404]</p>
      <h1 className="text-display text-white opacity-10 mb-10">Not found.</h1>
      <Link
        href="/"
        className="label text-white opacity-40 hover:opacity-100 transition-opacity duration-300 flex items-center gap-4"
      >
        <span className="w-6 h-px bg-white" />
        Return home
      </Link>
    </div>
  );
}
