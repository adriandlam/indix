"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@index/ui/components/input-otp";
import { useEffect, useState } from "react";
import { Button } from "@index/ui/components/button";
import { Input } from "@index/ui/components/input";
import { Label } from "@index/ui/components/label";
import { Loader } from "@index/ui/components/loader";
import { Separator } from "@index/ui/components/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@index/ui/components/form";
import { Link } from "@/components/link";
import Image from "next/image";
import { signIn, signUp } from "@/lib/auth-client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const formSchema = z.object({
  code: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const RESEND_TIME = 30;

export default function VerifyPage() {
  const [verifying, setVerifying] = useState(false);
  const [resendRemainingTime, setResendRemainingTime] = useState(RESEND_TIME);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  const code = form.watch("code");

  useEffect(() => {
    if (code.length === 6) {
      setVerifying(true);
    }
  }, [code]);

  useEffect(() => {
    if (resendRemainingTime > 0) {
      setTimeout(() => {
        setResendRemainingTime(resendRemainingTime - 1);
      }, 1000);
    }
  }, [resendRemainingTime]);

  async function onSubmit(data: FormValues) {
    try {
      //   await signUp.email({
      //     name: "",
      //     email: data.email,
      //     password: data.password,
      //   });

      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Failed to create account");
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="Index"
            width={32}
            height={32}
            className="w-12 h-12"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl tracking-tight font-medium text-center">
            Verify Email
          </h1>
          <p className="text-muted-foreground text-center">
            We&apos;ve sent a verification code to your email
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="code"
                disabled={verifying}
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="mx-auto">
                          <InputOTPSlot
                            index={0}
                            className="w-11 h-11 text-base"
                          />
                          <InputOTPSlot
                            index={1}
                            className="w-11 h-11 text-base"
                          />
                          <InputOTPSlot
                            index={2}
                            className="w-11 h-11 text-base"
                          />
                          <InputOTPSlot
                            index={3}
                            className="w-11 h-11 text-base"
                          />
                          <InputOTPSlot
                            index={4}
                            className="w-11 h-11 text-base"
                          />
                          <InputOTPSlot
                            index={5}
                            className="w-11 h-11 text-base"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <AnimatePresence>
                      {verifying && (
                        <motion.div
                          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                          transition={{
                            ease: "easeIn",
                            duration: 0.3,
                          }}
                          className="absolute top-1/2 -translate-y-1/2 right-15"
                        >
                          <Loader />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <p className="text-center text-xs text-muted-foreground">
            Didn&apos;t receive a code?{" "}
            <button
              className="cursor-pointer disabled:cursor-default underline underline-offset-4 hover:text-foreground transition-colors disabled:opacity-50 disabled:hover:text-muted-foreground"
              disabled={resendRemainingTime > 0}
              onClick={() => {
                setResendRemainingTime(RESEND_TIME);
              }}
            >
              {resendRemainingTime > 0
                ? `Resend code (${resendRemainingTime}s)`
                : "Resend code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
