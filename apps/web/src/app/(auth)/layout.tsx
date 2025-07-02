"use client";

import { Link } from "@/components/link";
import { Button } from "@indix/ui/components/button";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="max-w-screen-xl mx-auto p-4">
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
      <motion.nav
        initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          delay: 0.1,
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Button variant="ghost" size="sm" asChild>
          <Link removeUnderline href="/">
            <ChevronLeft />
            Back to Home
          </Link>
        </Button>
      </motion.nav>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(10px)", scale: 0.97 }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="drop-shadow-xl bg-gradient-to-tl from-background/75 to-background/10 border h-fit backdrop-blur-sm w-full max-w-xl p-12 rounded-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {children}
      </motion.div>
      {!pathname.includes("error") && (
        <footer className="text-center text-xs text-muted-foreground mt-4 max-w-sm mx-auto fixed bottom-4 left-1/2 -translate-x-1/2">
          By continuing, you agree to our{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </footer>
      )}
    </div>
  );
}
