"use client";

import { Button } from "@index/ui/components/button";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function WhyModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  useHotkeys("esc", () => setOpen(false), {
    enabled: open,
  });

  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
        Why?
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ filter: "blur(20px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(20px)" }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-background/75 backdrop-blur-lg rounded-md p-5 w-full max-w-lg border"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setOpen(false)}
                >
                  <X />
                </Button>
                <div className="space-y-4">
                  <h1 className="text-2xl font-medium">Why?</h1>
                  <p className="opacity-75">
                    <span className="font-medium font-serif opacity-100">
                      Index
                    </span>{" "}
                    was created as an open source alternative and fun side
                    project, built with a deep understanding of the importance
                    of private information.
                  </p>
                  <p className="opacity-75">
                    It&apos;s designed to be local-first, ensuring your data
                    stays with you, with optional cloud sync if you choose.
                  </p>
                  <p className="opacity-75">
                    Everything is privatized by design, and you bring your own
                    API keys to maintain complete control over your data.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
