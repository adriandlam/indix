import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <AuthNavbar />
      {children}
      <footer className="text-center text-xs text-muted-foreground mt-4 max-w-sm mx-auto fixed bottom-4 left-1/2 -translate-x-1/2">
        By continuing, you agree to index&apos;s{" "}
        <Link
          href="/terms"
          className="underline underline-offset-3 hover:text-foreground transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-3 hover:text-foreground transition-colors"
        >
          Privacy Policy
        </Link>
        , and to receive periodic emails with updates.
      </footer>
    </div>
  );
}

function AuthNavbar() {
  return (
    <nav className="w-full z-40 flex justify-center">
      <div className="mx-auto max-w-screen-xl p-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-medium tracking-tighter font-serif text-2xl hover:opacity-80 transition-opacity flex items-center gap-2.5"
        >
          <Image
            src="/logo.svg"
            alt="Index"
            width={32}
            height={32}
            className="w-9 h-9 rounded-lg border border-border/75"
          />
          <span>index</span>
        </Link>
      </div>
    </nav>
  );
}
