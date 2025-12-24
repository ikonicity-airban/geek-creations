"use client";

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
import { CONFIG } from "@/lib/config";
import { Logo } from "@/components/ui/logo";
import { Card } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const adminLoginSchema = z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .refine(
        (email) =>
          email.endsWith("@geekcreations.com") ||
          email.endsWith("@codeoven.tech") ||
          email === "admin@geekscreation.com",
        {
          message: "Access denied. Admin email required.",
        }
      ),
    password: z.string().min(1, "Password is required"),
  });

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof adminLoginSchema>) => {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (authError) {
      form.setError("root", { message: authError.message });
      return;
    }

    if (data.session) {
      // Wait a moment for session to be fully established, then redirect
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push("/admin/orders");
      router.refresh(); // Refresh to ensure session is available
    } else {
      form.setError("root", { message: "Failed to create session. Please try again." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* <div className="absolute inset-0 bg-black/40" /> */}

      <div className="relative z-10 w-full max-w-xl p-8">
        <Card className="bg-card shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto">
              <Logo className="size-20 mx-auto mb-4 md:size-30" />
            </div>
            <h4 className="text-3xl font-black">ADMIN ACCESS</h4>
            <p className="text-muted-foreground text-sm">
              {CONFIG.SITE.name} POD Store
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
              {form.formState.errors.root && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@geekcreations.com"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
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
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting
                  ? "Signing in..."
                  : "Sign In to Admin Panel"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Authorized personnel only. All activity is logged.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
