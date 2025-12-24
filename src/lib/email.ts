// lib/email.ts - EmailJS email service module
import { CONFIG } from "./config";

/**
 * Generate default HTML email content
 */
function generateDefaultEmailContent(
  orderName: string,
  trackingNumber?: string,
): string {
  const siteName = CONFIG.SITE.name;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #401268; margin-bottom: 20px;">Thank You for Your Order!</h1>

        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          We've received your order and we're excited to get it to you!
        </p>

        <div style="background-color: #f8f6f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #401268; margin-top: 0;">Order Details</h2>
          <p style="margin: 10px 0;"><strong>Order Number:</strong> ${orderName}</p>
          ${
            trackingNumber
              ? `<p style="margin: 10px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
                 <p style="color: #e2ae3d; font-weight: bold;">Your order has shipped! 🎉</p>`
              : `<p style="color: #666;">We're processing your order and will send you shipping updates soon.</p>`
          }
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 14px;">
            If you have any questions, please don't hesitate to contact us.
          </p>
          <p style="color: #401268; font-weight: bold; margin-top: 20px;">
            Best regards,<br/>
            The ${siteName} Team
          </p>
        </div>
      </div>
    </div>
  `;
}

export interface OrderConfirmationEmailParams {
  to_email: string;
  order_name: string;
  order_id: string | number;
  tracking_number?: string;
  from_name?: string;
  from_email?: string;
  subject?: string;
  html_content?: string;
}

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

/**
 * Get EmailJS configuration from centralized config
 */
function getEmailConfig(): EmailConfig | null {
  const { serviceId, templateId, publicKey } = CONFIG.EMAIL;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS not configured - missing environment variables:");
    console.warn("  NEXT_PUBLIC_EMAILJS_SERVICE_ID:", serviceId ? "✓" : "✗");
    console.warn("  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:", templateId ? "✓" : "✗");
    console.warn("  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:", publicKey ? "✓" : "✗");
    console.warn("Please add these to your .env.local file");
    return null;
  }

  console.log("EmailJS configuration loaded successfully");
  return { serviceId, templateId, publicKey };
}

/**
 * Send order confirmation email (client-side using EmailJS browser SDK)
 */
export async function sendOrderConfirmationEmailClient(
  params: OrderConfirmationEmailParams,
): Promise<{ success: boolean; error?: string }> {
  const config = getEmailConfig();

  if (!config) {
    return {
      success: false,
      error: "EmailJS not configured",
    };
  }

  try {
    // Dynamic import to ensure this only runs in browser
    const emailjs = (await import("@emailjs/browser")).default;

    const templateParams = {
      to_email: params.to_email,
      order_name: params.order_name,
      order_id: params.order_id.toString(),
      tracking_number: params.tracking_number || "",
      from_name: params.from_name || CONFIG.SITE.name,
      from_email: params.from_email || CONFIG.SITE.email,
      site_name: CONFIG.SITE.name,
      subject:
        params.subject ||
        `Order Confirmation - ${params.order_name || params.order_id}`,
      html_content:
        params.html_content ||
        generateDefaultEmailContent(params.order_name, params.tracking_number),
    };

    await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams,
      config.publicKey,
    );

    console.log(
      "✓ Order confirmation email sent successfully to:",
      params.to_email,
    );
    return { success: true };
  } catch (error) {
    console.error("✗ Failed to send order confirmation email:", error);
    console.error("Email params:", {
      to: params.to_email,
      order: params.order_name,
      has_tracking: !!params.tracking_number,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send order confirmation email (server-side using EmailJS REST API)
 */
export async function sendOrderConfirmationEmailServer(
  params: OrderConfirmationEmailParams,
): Promise<{ success: boolean; error?: string }> {
  const config = getEmailConfig();

  if (!config) {
    return {
      success: false,
      error: "EmailJS not configured",
    };
  }

  try {
    const templateParams = {
      to_email: params.to_email,
      order_name: params.order_name,
      order_id: params.order_id.toString(),
      tracking_number: params.tracking_number || "",
      from_name: params.from_name || CONFIG.SITE.name,
      from_email: params.from_email || CONFIG.SITE.email,
      site_name: CONFIG.SITE.name,
      subject:
        params.subject ||
        `Order Confirmation - ${params.order_name || params.order_id}`,
      html_content:
        params.html_content ||
        generateDefaultEmailContent(params.order_name, params.tracking_number),
    };

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: config.serviceId,
          template_id: config.templateId,
          user_id: config.publicKey,
          template_params: templateParams,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
    }

    console.log(
      "✓ Order confirmation email sent successfully (server-side) to:",
      params.to_email,
    );
    return { success: true };
  } catch (error) {
    console.error(
      "✗ Failed to send order confirmation email (server-side):",
      error,
    );
    console.error("Email params:", {
      to: params.to_email,
      order: params.order_name,
      has_tracking: !!params.tracking_number,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Validate email configuration
 */
export function isEmailConfigured(): boolean {
  return getEmailConfig() !== null;
}

/**
 * Get email configuration status (for debugging)
 */
export function getEmailConfigStatus(): {
  configured: boolean;
  serviceId: boolean;
  templateId: boolean;
  publicKey: boolean;
} {
  return {
    configured: isEmailConfigured(),
    serviceId: !!CONFIG.EMAIL.serviceId,
    templateId: !!CONFIG.EMAIL.templateId,
    publicKey: !!CONFIG.EMAIL.publicKey,
  };
}
