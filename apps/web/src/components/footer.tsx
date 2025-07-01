"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        delay: 1.75,
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="fixed bottom-0 left-0 w-full border-t border-dashed z-10 bg-background/25"
    >
      <div className="mx-auto max-w-screen-xl p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-muted-foreground text-center sm:text-left">
          <p>
            Created by{" "}
            <Link
              href="https://adriandlam.com"
              target="_blank"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Adrian
            </Link>
          </p>
          <ul className="flex items-center gap-2 justify-center sm:justify-start">
            <li>Privacy First</li>
            <li>•</li>
            <li>Local</li>
            <li>•</li>
            <li>Open Source</li>
          </ul>
        </div>
      </div>
    </motion.footer>
  );
}
