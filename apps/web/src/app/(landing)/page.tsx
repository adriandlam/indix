"use client";

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
import { Loader } from "@index/ui/components/loader";
import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { joinWaitlist } from "./actions";

const formSchema = z.object({
  email: z.string().email().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const result = await joinWaitlist({ email: data.email });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
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
      <div className="max-w-screen-md mx-auto px-4 space-y-8 py-32 md:py-60 z-0">
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
              className="text-4xl md:text-6xl tracking-tight font-serif font-medium text-center max-w-[40vw] mx-auto"
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
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="me@example.com"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs md:inline hidden">
                      I&apos;ll notify you when we&apos;re ready to launch
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Join the waitlist <Loader variant="secondary" />
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
