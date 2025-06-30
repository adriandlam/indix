import { motion } from "framer-motion";
import { cn } from "@index/ui/lib/utils";
import React from "react";

function TextGenerateEffect({
  text,
  className,
  as: Component = "h1",
}: {
  text: string;
  className?: string;
  as?: React.ElementType;
}) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    hidden: {
      opacity: 0,
      filter: "blur(20px)",
      y: 4,
    },
  };

  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, idx) => (
        <span key={idx}>
          <motion.span variants={child} className="inline-block">
            {word}
          </motion.span>
          {idx < words.length - 1 ? " " : ""}
        </span>
      ))}
    </MotionComponent>
  );
}

export default React.memo(TextGenerateEffect);
