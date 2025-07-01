import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full border-t border-dashed z-10 bg-background/25">
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
    </footer>
  );
}
