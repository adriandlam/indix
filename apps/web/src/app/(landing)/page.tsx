import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <Image
          src="/home/hero.png"
          alt="hero"
          fill
          className="object-cover scale-x-[1] scale-y-[-1]"
          quality={100}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      </div>
    </div>
  );
}
