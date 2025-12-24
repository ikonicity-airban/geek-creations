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
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirectTo = searchParams.get("redirect") || "/login";

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
        // Wait a moment for session to be fully established
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
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center mb-8">
            <CardTitle>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {redirectTo == "/checkout"
                  ? "Sign in to checkout"
                  : "Sign in to dashboard"}
              </p>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-5"
              >
                {form.formState.errors.root && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {form.formState.errors.root.message}
                    </p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
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
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10"
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
                  className="w-full font-semibold"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex items-baseline gap-2 text-xs mx-auto w-fit">
            {"Don't"} have an account?{" "}
            <Link
              href={`/signup${
                redirectTo !== "/checkout"
                  ? `?redirect=${encodeURIComponent(redirectTo)}`
                  : ""
              }`}
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-md">
            <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-2xl p-8 shadow-xl border border-gray-200/70 dark:border-gray-700/70">
              <p className="text-center text-gray-600 dark:text-gray-400">
                Loading...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
