import { Geist, Geist_Mono } from "next/font/google";

import "@index/ui/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@index/ui/components/sonner";
import { Loader } from "@index/ui/components/loader";
import {
  CircleAlert,
  CircleCheck,
  Info,
  InfoIcon,
  OctagonX,
  TriangleAlert,
} from "lucide-react";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
        <Toaster
          richColors
          icons={{
            success: <CircleCheck className="size-5" />,
            info: <Info className="size-5" />,
            warning: <TriangleAlert className="size-5" />,
            error: <CircleAlert className="size-5" />,
            loading: <Loader />,
          }}
          visibleToasts={1}
        />
      </body>
    </html>
  );
}
