import Hero from "@/components/home/Hero";
import HeroMobile from "@/components/home/HeroMobile";

export default function Home() {
  return (
    <>
      <div className="md:hidden">
        <HeroMobile />
      </div>
      <div className="hidden md:block">
        <Hero />
      </div>
    </>
  );
}
