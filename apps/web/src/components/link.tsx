import NextLink from "next/link";
import { cn } from "@index/ui/lib/utils";

interface LinkProps {
  href: string;
  removeUnderline?: boolean;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function Link({
  href,
  removeUnderline = false,
  children,
  className,
  external = false,
  ...props
}: LinkProps) {
  const linkClasses = cn(
    removeUnderline
      ? "hover:text-foreground transition-colors"
      : "underline underline-offset-4 hover:text-foreground transition-colors",
    className
  );

  if (external) {
    return (
      <NextLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
        {...props}
      >
        {children}
      </NextLink>
    );
  }

  return (
    <NextLink href={href} className={linkClasses} {...props}>
      {children}
    </NextLink>
  );
}
