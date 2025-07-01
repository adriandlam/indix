"use client";

import { useRef, useState, useEffect } from "react";
import TextGenerateEffect from "@/components/text-generate-effect";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@index/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@index/ui/components/form";
import { Input } from "@index/ui/components/input";
import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { joinWaitlist } from "./actions";
import { useHotkeys } from "react-hotkeys-hook";
import { Loader } from "@index/ui/components/loader";

const formSchema = z.object({
  email: z.string().email().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isValidating, setIsValidating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const emailValue = form.watch("email");

  // Debounced validation state
  useEffect(() => {
    if (!emailValue) {
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    const timer = setTimeout(() => {
      setIsValidating(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [emailValue]);

  useHotkeys(
    "slash",
    () => {
      inputRef.current?.focus();
    },
    {
      enabled: true,
      preventDefault: true,
    }
  );

  useHotkeys(
    "esc",
    () => {
      inputRef.current?.blur();
    },
    {
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "enter",
    () => {
      form.handleSubmit(onSubmit)();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  async function onSubmit(data: FormValues) {
    const promise = joinWaitlist({ email: data.email });
    toast.promise(promise, {
      loading: "Joining...",
      success: (data) => data.message,
      error: (error) => error.message,
    });
  }

  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <Image
          src="/home/hero.png"
          alt="hero"
          fill
          className="object-cover scale-x-[1] scale-y-[-1]"
          quality={100}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      </div>
      <div className="max-w-screen-md mx-auto px-4 space-y-8 my-32 md:my-60 z-0">
        <div className="space-y-4">
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 1.5,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="shadow-inner font-mono border bg-orange-500/25 border-orange-800 text-xs text-orange-500 mx-auto text-center max-w-fit px-2.5 py-0.5 rounded-full"
            >
              In Development
            </motion.div>
            <TextGenerateEffect
              text="Write your thoughts, keep your privacy"
              className="text-4xl md:text-6xl tracking-tight font-serif font-medium text-center lg:max-w-[40vw] mx-auto"
            />
          </div>
          <motion.p
            className="text-lg text-center max-w-lg mx-auto"
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 0.75, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: 0.75,
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Index is the intelligent note-taking platform. AI-powered insights
            that never leave your device.
          </motion.p>
        </div>
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 1,
            duration: 2.25,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Form {...form}>
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
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
