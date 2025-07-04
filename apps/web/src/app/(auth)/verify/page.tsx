"use client";

import { authClient, useSession } from "@/lib/auth-client";
import useEncryptionStore from "@/stores/encryption-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@indix/ui/components/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@indix/ui/components/input-otp";
import { Loader } from "@indix/ui/components/loader";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  code: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const RESEND_TIME = 30;

export default function VerifyPage() {
  const [verifying, setVerifying] = useState(false);
  const [resendRemainingTime, setResendRemainingTime] = useState(RESEND_TIME);
  const session = useSession();
  const router = useRouter();
  const { password, setEncryptionKey } = useEncryptionStore();

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
      onSubmit({ code }).finally(() => {
        setVerifying(false);
      });
    }
  }, [code]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendRemainingTime > 0) {
      timer = setTimeout(() => {
        setResendRemainingTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [resendRemainingTime]);

  async function onSubmit(formData: FormValues) {
    if (!session.data?.user?.email) {
      router.push("/sign-up");
      return;
    }

    // TODO: implement encryption
    // const encryptionSalt = session.data?.user?.encryptionSalt;

    // const encryptionKey = await deriveScryptKey(
    //   password,
    //   session.data?.user?.encryptionSalt
    // );

    // const key = await deriveScryptKey(password, encryptionSalt);

    // console.log(key);

    // return;

    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email: session.data?.user?.email,
        otp: formData.code,
      });
      if (error) {
        toast.error(error.message);
        return;
      }

      router.push("/notes");
      toast.success("Account verified successfully!");
    } catch (error) {
      toast.error("Failed to verify email, please try again.");
    } finally {
      setVerifying(false);
    }
  }

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
            Verify Your Email
          </h1>
          <p className="text-muted-foreground text-center max-w-sm mx-auto">
            We&apos;ve sent a verification code to your email
          </p>
        </div>
      </div>
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-4.5">
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
              onClick={async () => {
                setResendRemainingTime(RESEND_TIME);
                if (session.data?.user?.email) {
                  await authClient.emailOtp.sendVerificationOtp({
                    email: session.data?.user?.email,
                    type: "email-verification",
                  });
                }
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
