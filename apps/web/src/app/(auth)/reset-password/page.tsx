"use client";

import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@indix/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@indix/ui/components/form";
import { Input } from "@indix/ui/components/input";
import { Loader } from "@indix/ui/components/loader";
import { cn } from "@indix/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Suspense } from "react";

const formSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .refine((val) => val.trim().length === val.length, {
      message: "Password cannot start or end with spaces",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 justify-center h-screen">
          <Loader variant="secondary" />
          <span>Loading...</span>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
    mode: "onChange",
  });

  if (!token) {
    router.push("/sign-in");
    return null;
  }

  async function onSubmit(formData: FormValues) {
    try {
      const { error } = await authClient.resetPassword({
        newPassword: formData.password,
        token,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Failed to reset password, please try again.");
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
            Reset Your Password
          </h1>
          <p className="text-muted-foreground text-center max-w-sm mx-auto">
            Enter your new password and we&apos;ll reset it.
          </p>
        </div>
      </div>
      <div className="max-w-sm mx-auto space-y-6">
        <div className="space-y-4.5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant={showPassword ? "outline" : "ghost"}
                        size="icon"
                        className={cn(
                          "absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-sm",
                          showPassword ? "" : "text-muted-foreground"
                        )}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <AnimatePresence mode="wait">
                          {showPassword ? (
                            <motion.div
                              key="eye-off"
                              initial={{ opacity: 0, filter: "blur(10px)" }}
                              animate={{ opacity: 1, filter: "blur(0px)" }}
                              transition={{
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            >
                              <EyeOffIcon className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="eye"
                              initial={{ opacity: 0, filter: "blur(10px)" }}
                              animate={{ opacity: 1, filter: "blur(0px)" }}
                              transition={{
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader variant="secondary" />
                    <span>Resetting password...</span>
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
