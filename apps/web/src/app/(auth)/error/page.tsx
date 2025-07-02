"use client";

import { Link } from "@/components/link";
import { Button } from "@indix/ui/components/button";
import Image from "next/image";

export default function VerifyPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="indix"
            width={32}
            height={32}
            className="w-12 h-12"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl tracking-tight font-medium text-center">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-center">
            We&apos;re sorry, but something went wrong. Please try again later.
          </p>
        </div>
      </div>
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-4.5">
          {/* <div>
            </div> */}
          {/* <div className="flex items-center gap-2 justify-center h-11 bg-background/50 backdrop-blur-sm border border-border/50 rounded-md">
              <Loader />
              <span className="text-sm font-medium">Redirecting...</span>
            </div> */}
          {/* </div> */}
          <p className="text-center text-xs text-muted-foreground">
            If you think this is an error, please contact me at{" "}
            <Link href="mailto:me@adriandlam.com">me@adriandlam.com</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
