"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";
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

export default function ContactPage() {
  const [success, setSuccess] = useState(false);

  const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
  });

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof contactSchema>) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    try {
      // TODO: Implement actual contact form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      form.reset();
    } catch (err) {
      console.log("🚀 ~ handleSubmit ~ err:", err);
      form.setError("root", {
        message: "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="pt-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have a question or need help? {"We'd"} love to hear from you. Send us
          a message and {"we'll"} respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
          >
            <Mail className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Email Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              support@geekcreations.com
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              hello@geekcreations.com
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
          >
            <Phone className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Call Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              +234 800 000 0000
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Mon - Fri, 9am - 5pm WAT
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
          >
            <MapPin className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Visit Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              123 Innovation Street
              <br />
              Lagos, Nigeria
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
          >
            <Clock className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Response Time
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We typically respond within 24 hours during business days.
            </p>
          </motion.div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Send us a Message
              </h2>
            </div>

            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  Thank you! Your message has been sent. {"We'll"} get back to
                  you soon.
                </p>
              </div>
            )}

            {form.formState.errors.root && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-6">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {form.formState.errors.root.message}
                </p>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="John Doe"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="How can we help?"
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
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <textarea
                          rows={6}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                          placeholder="Tell us more about your inquiry..."
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
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
