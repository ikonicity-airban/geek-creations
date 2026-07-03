"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { sendOrderConfirmationEmailClient } from "@/lib/email";
import { getEmailConfigStatus } from "@/lib/email";
import { Mail, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export function EmailDebug() {
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const configStatus = getEmailConfigStatus();

  const handleTestEmail = async () => {
    if (!testEmail) {
      setResult({ success: false, message: "Please enter an email address" });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await sendOrderConfirmationEmailClient({
        to_email: testEmail,
        order_name: "#TEST-001",
        order_id: "test-123",
        tracking_number: "TRK123456789",
      });

      setResult({
        success: response.success,
        message: response.success
          ? "Test email sent successfully! Check your inbox."
          : `Failed to send: ${response.error}`,
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">EmailJS Debug Panel</h2>
        </div>

        {/* Configuration Status */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Configuration Status</h3>
          <div className="space-y-1 text-sm">
            <ConfigItem
              label="EmailJS Configured"
              status={configStatus.configured}
            />
            <ConfigItem
              label="Service ID"
              status={configStatus.serviceId}
              indent
            />
            <ConfigItem
              label="Template ID"
              status={configStatus.templateId}
              indent
            />
            <ConfigItem
              label="Public Key"
              status={configStatus.publicKey}
              indent
            />
          </div>
        </div>

        {/* Environment Variables Help */}
        {!configStatus.configured && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                  Missing EmailJS Configuration
                </p>
                <p className="text-yellow-800 dark:text-yellow-300 mb-2">
                  Add these environment variables to your{" "}
                  <code className="bg-yellow-100 dark:bg-yellow-800 px-1 py-0.5 rounded">
                    .env.local
                  </code>{" "}
                  file:
                </p>
                <pre className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded text-xs overflow-x-auto">
                  {`NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Test Email Form */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Send Test Email</h3>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              disabled={!configStatus.configured || sending}
            />
            <Button
              onClick={handleTestEmail}
              disabled={!configStatus.configured || sending || !testEmail}
            >
              {sending ? "Sending..." : "Send Test"}
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`flex items-start gap-2 p-3 rounded-lg ${
                result.success
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  result.success
                    ? "text-green-800 dark:text-green-300"
                    : "text-red-800 dark:text-red-300"
                }`}
              >
                {result.message}
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            EmailJS Template Setup
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
            <li>
              Go to{" "}
              <a
                href="https://dashboard.emailjs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                EmailJS Dashboard
              </a>
            </li>
            <li>Create a new email template</li>
            <li>
              Set <strong>Subject:</strong>{" "}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded text-xs">
                {"{"}
                {"{"}-subject{"}}"}
              </code>
            </li>
            <li>
              Set <strong>Body:</strong>{" "}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded text-xs">
                {"{{"}
                {"{"}html_content{"}}"}
                {"}"}
              </code>
            </li>
            <li>Copy Service ID, Template ID, and Public Key to .env.local</li>
            <li>Restart your dev server</li>
          </ol>
        </div>
      </div>
    </Card>
  );
}

function ConfigItem({
  label,
  status,
  indent = false,
}: {
  label: string;
  status: boolean;
  indent?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${indent ? "ml-4" : ""}`}>
      {status ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <XCircle className="w-4 h-4 text-red-600" />
      )}
      <span className={status ? "text-green-700" : "text-red-700"}>
        {label}
      </span>
    </div>
  );
}
