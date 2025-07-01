"use client";

import { useRouter } from "next/navigation";
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
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@index/ui/lib/utils";

const formSchema = z.object({
  email: z.string().email().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .refine((val) => val.trim().length === val.length, {
      message: "Password cannot start or end with spaces",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: FormValues) {
    await signUp.email(
      {
        name: "",
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push("/verify?email=" + data.email);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
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
            Welcome to <span className="font-serif">index</span>
          </h1>
          <p className="text-muted-foreground text-center">
            Get started with the private, intelligent note-taking platform
          </p>
        </div>
      </div>
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-2.5">
          <Button
            variant="outline"
            className="w-full"
            disabled={form.formState.isSubmitting || githubLoading}
            onClick={() => {
              setGithubLoading(true);
              signIn.social({
                provider: "github",
                callbackURL: "/notes",
                errorCallbackURL: "/error",
                newUserCallbackURL: "/notes?onboarding=true",
              });
            }}
          >
            <AnimatePresence mode="wait">
              {githubLoading ? (
                <motion.div
                  key="github-loading"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    ease: "easeIn",
                    duration: 0.3,
                  }}
                >
                  <Loader />
                </motion.div>
              ) : (
                <svg
                  role="img"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              )}
            </AnimatePresence>
            Continue with GitHub
          </Button>
          {/* <Button variant="outline" className="w-full">
            <Loader />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </Button> */}
        </div>

        <div className="flex items-center gap-2.5">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-sm">or</span>
          <Separator className="flex-1" />
        </div>

        <div className="space-y-4.5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4.5"
            >
              <FormField
                disabled={form.formState.isSubmitting || githubLoading}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="me@example.com"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={form.formState.isSubmitting || githubLoading}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Password"
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
                disabled={form.formState.isSubmitting || githubLoading}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader variant="secondary" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
        {/* <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 1,
            duration: 2.25,
            ease: [0.16, 1, 0.3, 1],
          }}
        > */}
        {/* <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col md:flex-row gap-2 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled={form.formState.isSubmitting}
                          placeholder="Press / to focus"
                          required
                          {...field}
                          ref={(e) => {
                            field.ref(e);
                            inputRef.current = e;
                          }}
                        />
                        {isValidating &&
                          emailValue &&
                          !form.formState.isSubmitting && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                              <Loader />
                            </div>
                          )}
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs md:inline hidden ml-2">
                      I&apos;ll notify you when we&apos;re ready to launch
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader variant="secondary" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <span>Join the waitlist</span>
                )}
              </Button>
            </form>
          </Form> */}
        {/* </motion.div> */}
      </div>
    </div>
  );
}
