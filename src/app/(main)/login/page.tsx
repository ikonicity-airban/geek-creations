"use client";

import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthTestimonialSide } from "@/components/auth/auth-testimonial-side";
import { Logo } from "@/components/ui/logo";
import { MerchandiseDoodleBackground } from "@/components/auth/merchandise-doodle-bg";
import { ScrollArea } from "@/components/ui/scroll-area";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirectTo = searchParams.get("redirect") || "/account";

  const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: values.email,
          password: values.password,
        }
      );

      if (authError) {
        form.setError("root", { message: authError.message });
        return;
      }

      if (data.session) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push(redirectTo);
        router.refresh();
      } else {
        form.setError("root", {
          message: "Failed to create session. Please try again.",
        });
      }
    } catch {
      form.setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex bg-background text-foreground overflow-hidden">
      {/* Left Column (60% width): Form Side */}
      <div className="w-full lg:w-[60%] h-full flex flex-col justify-between p-6 sm:p-8 lg:p-20 z-10 order-1 overflow-hidden">
        {/* Top Header: Centered Logo with Back Link */}
        <div className="relative flex items-center justify-between w-full pb-4 border-b border-border/40">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <div className="w-16" /> {/* Balance flex header */}
        </div>

        {/* Form Dedicated Internal Scroll Area */}
        <ScrollArea className="flex-1 my-auto max-h-[calc(100vh-130px)] max-w-lg w-full mx-auto py-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {redirectTo === "/checkout"
                  ? "Sign in to complete your order checkout"
                  : "Sign in to access your orders, saved designs, and account settings"}
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-5"
              >
                {form.formState.errors.root && (
                  <div className="p-3 bg-destructive/15 border border-destructive/30 rounded-xl">
                    <p className="text-xs font-semibold text-destructive">
                      {form.formState.errors.root.message}
                    </p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider">
                        Email Address
                      </FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10 h-12 rounded-xl bg-card border-border text-sm transition-all focus:ring-2 focus:ring-primary/20"
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider">
                        Password
                      </FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 h-12 rounded-xl bg-card border-border text-sm transition-all focus:ring-2 focus:ring-primary/20"
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl font-bold text-sm bg-primary text-primary-foreground shadow-lg hover:opacity-95 transition-all"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing in..." : "Sign In to Account"}
                </Button>
              </form>
            </Form>

            {/* Footer link */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/40">
              Don&apos;t have an account?{" "}
              <Link
                href={`/signup${redirectTo !== "/account"
                  ? `?redirect=${encodeURIComponent(redirectTo)}`
                  : ""
                  }`}
                className="text-primary hover:underline font-bold"
              >
                Create an account
              </Link>
            </div>
          </motion.div>
        </ScrollArea>

        {/* Bottom spacing */}
        <div className="text-center text-[10px] text-muted-foreground pt-2">
          Protected by Supabase Authentication
        </div>
      </div>

      {/* Right Column (40% width): Visual & Testimonials Side */}
      <AuthTestimonialSide />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-background text-foreground">
          <div className="w-full max-w-md text-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading authentication...
            </p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
