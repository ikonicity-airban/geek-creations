"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
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
import { Mail, Lock, User, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthTestimonialSide } from "@/components/auth/auth-testimonial-side";
import { Logo } from "@/components/ui/logo";
import { MerchandiseDoodleBackground } from "@/components/auth/merchandise-doodle-bg";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SignupPage() {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const signupSchema = z
    .object({
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      });

      if (signUpError) {
        form.setError("root", { message: signUpError.message });
        return;
      }

      if (data.user) {
        setSuccess(true);
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get("redirect") || "/account";
        setTimeout(() => {
          router.push(redirectTo);
        }, 2000);
      }
    } catch (err) {
      console.log("🚀 ~ handleSignup ~ err:", err);
      form.setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex bg-background text-foreground overflow-hidden">
      {/* Left Column (60% width): Form Side */}
      <div className="w-full lg:w-[60%] h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 z-10 order-1 overflow-hidden">
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
            className="space-y-5"
          >
            {/* Title */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Join Geek Creations to start designing cups, sweaters, jotters, and apparel
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 px-6 rounded-2xl bg-card border border-border shadow-lg"
              >
                <CheckCircle2 className="w-14 h-14 mx-auto mb-3 text-emerald-500" />
                <h3 className="text-xl font-extrabold text-foreground mb-2">
                  Account Created!
                </h3>
                <p className="text-xs text-muted-foreground">
                  Redirecting to your account dashboard...
                </p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSignup)}
                  className="space-y-3.5"
                >
                  {form.formState.errors.root && (
                    <div className="p-3 bg-destructive/15 border border-destructive/30 rounded-xl">
                      <p className="text-xs font-semibold text-destructive">
                        {form.formState.errors.root.message}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold uppercase tracking-wider">
                            First Name
                          </FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="John"
                                className="pl-9 h-10 rounded-xl bg-card border-border text-xs"
                                disabled={form.formState.isSubmitting}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold uppercase tracking-wider">
                            Last Name
                          </FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Doe"
                                className="pl-9 h-10 rounded-xl bg-card border-border text-xs"
                                disabled={form.formState.isSubmitting}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-wider">
                          Email Address
                        </FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              className="pl-9 h-10 rounded-xl bg-card border-border text-xs"
                              disabled={form.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-wider">
                          Password
                        </FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="At least 6 characters"
                              className="pl-9 h-10 rounded-xl bg-card border-border text-xs"
                              disabled={form.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-wider">
                          Confirm Password
                        </FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm password"
                              className="pl-9 h-10 rounded-xl bg-card border-border text-xs"
                              disabled={form.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl font-bold text-xs bg-primary text-primary-foreground shadow-lg hover:opacity-95 transition-all mt-3"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Creating Account..."
                      : "Create Account"}
                  </Button>
                </form>
              </Form>
            )}

            {/* Footer link */}
            <div className="text-center text-xs text-muted-foreground pt-3 border-t border-border/40">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-bold"
              >
                Sign in
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
