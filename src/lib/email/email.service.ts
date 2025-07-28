import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";

// Initialize Resend with error handling
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error("❌ RESEND_API_KEY is not configured in environment variables");
  throw new Error("RESEND_API_KEY is not configured in environment variables");
}

const resend = new Resend(resendApiKey);

// Default sender email if none configured (using your verified domain)
const DEFAULT_FROM = "Reebews <noreply@resend.reebews.com>";

// Check if custom from email is configured
const fromEmail = process.env.REEBEWS_EMAIL_FROM || DEFAULT_FROM;

// ReeBews logo URL for email embedding (more reliable than base64 in emails)
const getLogoUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://reebews.com";
  return `${baseUrl}/uploads/logo/reebews-logo.png`;
};

export class EmailService {
  /**
   * Send signup email with token
   */
  static async sendSignupEmail(
    email: string,
    firstName: string,
    lastName: string,
    signupToken: string,
    planDetails: {
      plan: string;
      amount: number;
      currency: string;
      billingCycle: string;
    }
  ) {
    try {
      console.log(`📧 Attempting to send signup email to: ${email}`);
      console.log(`📧 Plan details:`, planDetails);

      const signupUrl = `https://admin.reebews.com/signup/${signupToken}`;

      const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ReeBews</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f5;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .logo {
                text-align: center;
                padding: 20px 0;
                background-color: #ffffff;
                border-radius: 10px 10px 0 0;
              }
              .logo img {
                height: 40px;
                width: auto;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              .header p {
                margin: 10px 0 0;
                opacity: 0.9;
              }
              .content {
                background: #ffffff;
                padding: 40px 30px;
                border-radius: 0 0 10px 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .plan-details {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #ffb000;
              }
              .plan-details h3 {
                margin: 0 0 15px;
                color: #1e293b;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #ffb000 0%, #f59e0b 100%);
                color: white;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                text-align: center;
                transition: all 0.3s ease;
              }
              .button:hover {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              }
              .features {
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .feature-item {
                display: flex;
                align-items: center;
                margin: 10px 0;
              }
              .feature-item span {
                margin-left: 10px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                color: #64748b;
                font-size: 14px;
              }
              .divider {
                height: 1px;
                background: #e2e8f0;
                margin: 20px 0;
              }
              .highlight {
                color: #ffb000;
                font-weight: 600;
              }
              .warning {
                background: #fff3cd;
                color: #856404;
                border-left: 4px solid #ffb000;
                padding: 16px;
                border-radius: 6px;
                margin: 24px 0 0 0;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <img src="${getLogoUrl()}" alt="ReeBews Logo" />
              </div>
              
              <div class="header">
                <h1>🎉 Welcome to ReeBews!</h1>
                <p>Your payment was successful. Let's get your account set up!</p>
              </div>
              
              <div class="content">
                <h2>Hi ${firstName} ${lastName},</h2>
                
                <p>Thank you for choosing ReeBews! We're thrilled to have you on board. Your payment has been processed successfully, and we're ready to help you get started.</p>
                
                <div class="plan-details">
                  <h3>📋 Your Plan Details</h3>
                  <p><strong>Plan:</strong> ${planDetails.plan}</p>
                  <p><strong>Billing Cycle:</strong> ${planDetails.billingCycle}</p>
                  <p><strong>Amount:</strong> ${planDetails.currency} ${planDetails.amount.toFixed(2)}</p>
                </div>
                
                <p>To complete your account setup and start using ReeBews, click the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${signupUrl}" class="button">
                    🚀 Complete Account Setup
                  </a>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Important:</strong> You must complete your signup within <b>24 hours</b> or your signup link will expire.<br>
                  If your link has expired, please contact <a href="mailto:contact@reebews.com">contact@reebews.com</a> for assistance.
                </div>
                
                <div class="features">
                  <h3>What's Next?</h3>
                  <div class="feature-item">
                    ✨ <span>Set up your personalized dashboard</span>
                  </div>
                  <div class="feature-item">
                    📊 <span>Access detailed analytics and insights</span>
                  </div>
                  <div class="feature-item">
                    🎯 <span>Start tracking your performance</span>
                  </div>
                  <div class="feature-item">
                    🔧 <span>Configure your account settings</span>
                  </div>
                </div>
                
                <div class="divider"></div>
                
                <p>Need help? Our support team is available 24/7 to assist you with any questions.</p>
                
                <p>Best regards,<br><span class="highlight">The ReeBews Team</span></p>
              </div>
              
              <div class="footer">
                <p>This email was sent to ${email}</p>
                <p>© ${new Date().getFullYear()} ReeBews. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

      // Plain text version of the email
      const textContent = `
Welcome to ReeBews!

Hi ${firstName} ${lastName},

Thank you for choosing ReeBews! We're thrilled to have you on board. Your payment has been processed successfully, and we're ready to help you get started.

Your Plan Details:
- Plan: ${planDetails.plan}
- Billing Cycle: ${planDetails.billingCycle}
- Amount: ${planDetails.currency} ${planDetails.amount.toFixed(2)}

To complete your account setup and start using ReeBews, visit:
${signupUrl}

IMPORTANT: You must complete your signup within 24 hours or your signup link will expire.
If your link has expired, please contact contact@reebews.com for assistance.

What's Next?
✨ Set up your personalized dashboard
📊 Access detailed analytics and insights
🎯 Start tracking your performance
🔧 Configure your account settings

Need help? Our support team is available 24/7 to assist you with any questions.

Best regards,
The ReeBews Team

© ${new Date().getFullYear()} ReeBews. All rights reserved.
This email was sent to ${email}
      `.trim();

      const emailOptions: CreateEmailOptions = {
        from: fromEmail,
        to: [email],
        subject: "Welcome to ReeBews - Complete Your Account Setup",
        html: htmlContent,
        text: textContent,
        tags: [
          {
            name: "category",
            value: "signup",
          },
          {
            name: "plan",
            value: planDetails.plan.toLowerCase().replace(/\s+/g, "-"),
          },
        ],
      };

      const { data, error } = await resend.emails.send(emailOptions);

      if (error) {
        console.error("❌ Error sending signup email:", error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log("✅ Signup email sent successfully:", data);
      return { success: true, data };
    } catch (error: any) {
      console.error("❌ Error in sendSignupEmail:", error);
      throw error;
    }
  }
}
