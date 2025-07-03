"use client";

import { Link } from "@/components/link";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@indix/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@indix/ui/components/form";
import { Input } from "@indix/ui/components/input";
import { Loader } from "@indix/ui/components/loader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  async function onSubmit(formData: FormValues) {
    try {
      const { error } = await authClient.requestPasswordReset({
        email: formData.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(
        "If the email exists, you'll receive a link to reset your password."
      );
    } catch (error) {
      toast.error("Failed to send reset password email, please try again.");
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
            Enter your email and if it exists, we&apos;ll send you a link to
            reset your password.
          </p>
        </div>
      </div>
      <div className="max-w-sm mx-auto space-y-">
        <div className="space-y-4.5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="me@example.com"
                        className="w-full"
                      />
                    </FormControl>
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
                    <span>Sending reset password email...</span>
                  </>
                ) : (
                  "Send reset password email"
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
