import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function RefundPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">REFUND POLICY</h1>
      
      <p className="text-sm text-muted-foreground mb-8">
        <strong>Last Updated:</strong> 17-July-2025
      </p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. INTRODUCTION</h2>
          <p className="text-foreground leading-relaxed">
            This Refund Policy outlines the terms and conditions for refunds on Reebews ("we," "our," or "us") review 
            platform services. This policy applies to all users who have purchased our services and should be read in 
            conjunction with our Terms of Service and Privacy Policy.
          </p>
          <p className="text-foreground leading-relaxed mt-4">
            By purchasing our services, you agree to the terms outlined in this Refund Policy. We are committed to 
            providing quality services and will process eligible refunds in accordance with the conditions specified below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. ELIGIBLE REFUNDS</h2>
          
          <h3 className="text-lg font-medium mb-3">2.1 Failed Payment Refunds</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            We provide refunds for failed payments that have been debited from your account but the service was not 
            activated or delivered due to technical issues on our end.
          </p>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Conditions:</h4>
            <ul className="list-disc pl-6 text-foreground space-y-1">
              <li>Payment amount has been debited from your account</li>
              <li>Service was not activated or delivered due to our technical failure</li>
              <li>You can provide proof of payment deduction</li>
              <li>Request must be made within 7 days of the failed transaction</li>
            </ul>
          </div>
          
          <h3 className="text-lg font-medium mb-3">2.2 Initial Service Purchase Refunds</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            We offer refunds for initial service purchases if our platform does not meet your requirements or is not 
            the right fit for your business needs.
          </p>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Conditions:</h4>
            <ul className="list-disc pl-6 text-foreground space-y-1">
              <li>Refund request must be made within <strong>7 days</strong> from the date of purchase</li>
              <li>Applies only to the <strong>initial purchase</strong> of services</li>
              <li>Service must not be the right fit for your business requirements</li>
              <li>Account must not have violated our Terms of Service</li>
              <li>Refund amount will be the full purchase price minus any applicable processing fees</li>
            </ul>
          </div>
          
          <h3 className="text-lg font-medium mb-3">2.3 Recurring Payment Refunds</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            For users with recurring subscription services, we provide refunds for recent recurring payments under 
            specific conditions.
          </p>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Conditions:</h4>
            <ul className="list-disc pl-6 text-foreground space-y-1">
              <li>Refund request must be made within <strong>3 days</strong> from the date the recurring payment was deducted from your bank account</li>
              <li>Applies only to <strong>renewed/recurring payments</strong>, not initial purchases</li>
              <li>Service must not have been extensively used during the billing period</li>
              <li>Account must be in good standing without Terms of Service violations</li>
              <li>Refund amount will be the full recurring payment amount minus any applicable processing fees</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. NON-REFUNDABLE SERVICES</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            The following services and purchases are <strong>NOT eligible</strong> for refunds under any circumstances:
          </p>
          
          <h3 className="text-lg font-medium mb-3">3.1 Additional Credits</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Review Credits:</strong> Credits purchased to collect reviews from customers are non-refundable once purchased.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Product Credits:</strong> Credits purchased to collect reviews on specific products are non-refundable once purchased.
          </p>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Reason for Non-Refundability:</h4>
            <ul className="list-disc pl-6 text-foreground space-y-1">
              <li>These credits are consumable digital goods</li>
              <li>They provide immediate value upon purchase</li>
              <li>They cannot be "returned" once the credit allocation is made to your account</li>
              <li>Usage of these credits is immediate and irreversible</li>
            </ul>
          </div>
          
          <h3 className="text-lg font-medium mb-3">3.2 Partially Used Services</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Services that have been actively used beyond the trial or evaluation period</li>
            <li>Accounts with significant data generation or platform usage</li>
            <li>Services where substantial business value has been derived</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">3.3 Promotional and Discounted Services</h3>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>Services purchased at promotional prices or with discount codes</li>
            <li>Free trial extensions or bonus services</li>
            <li>Bundled services where individual components cannot be separated</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. REFUND PROCESS</h2>
          
          <h3 className="text-lg font-medium mb-3">4.1 How to Request a Refund</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            To request a refund, please contact our customer support team:
          </p>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> contact@reebews.com
            </p>
          </div>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Required Information:</h4>
            <ul className="list-disc pl-6 text-foreground space-y-1">
              <li>Your account email address</li>
              <li>Order/transaction ID</li>
              <li>Date of purchase or payment deduction</li>
              <li>Reason for refund request</li>
              <li>Supporting documentation (bank statements, payment confirmations)</li>
            </ul>
          </div>
          
          <h3 className="text-lg font-medium mb-3">4.2 Refund Processing Timeline</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><strong>Review Period:</strong> 5-7 business days from receipt of refund request</li>
            <li><strong>Approval Notification:</strong> Email confirmation of refund approval or denial</li>
            <li><strong>Processing Time:</strong> 7-14 business days for approved refunds</li>
            <li><strong>Bank Processing:</strong> Additional 3-5 business days depending on your bank</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">4.3 Refund Method</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            Refunds will be processed through the same payment method used for the original purchase:
          </p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li><strong>Razorpay Payments:</strong> Refunded to the original payment method (card/bank account)</li>
            <li><strong>PayPal Payments:</strong> Refunded to your PayPal account</li>
            <li><strong>Bank Transfers:</strong> Refunded to the original bank account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. REFUND CONDITIONS AND LIMITATIONS</h2>
          
          <h3 className="text-lg font-medium mb-3">5.1 Service Termination</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Upon refund approval, your access to the refunded service will be immediately terminated</li>
            <li>All data associated with the refunded service may be permanently deleted</li>
            <li>You will lose access to any reports, analytics, or generated content</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">5.2 Data Export</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Before requesting a refund, ensure you have exported any important data</li>
            <li>We recommend downloading reports and backing up essential information</li>
            <li>Post-refund data recovery may not be possible</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">5.3 Future Service Access</h3>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>Refunded customers may re-purchase services at any time</li>
            <li>Previous refunds do not affect eligibility for future purchases</li>
            <li>However, repeated refund requests may be subject to additional review</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. SPECIAL CIRCUMSTANCES</h2>
          
          <h3 className="text-lg font-medium mb-3">6.1 Technical Issues</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            If you experience technical issues that prevent you from using our services:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Contact our support team immediately</li>
            <li>We will first attempt to resolve the technical issue</li>
            <li>If the issue cannot be resolved within a reasonable timeframe, a refund may be considered</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">6.2 Service Downtime</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Planned maintenance and brief service interruptions do not qualify for refunds</li>
            <li>Extended unplanned outages may be eligible for service credits or partial refunds</li>
            <li>We will communicate any significant service disruptions through email and platform notifications</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">6.3 Account Violations</h3>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>Refunds will not be provided for accounts terminated due to Terms of Service violations</li>
            <li>Fraudulent activity or misuse of services disqualifies accounts from refunds</li>
            <li>Chargebacks initiated without first contacting our support team may result in account suspension</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. DISPUTE RESOLUTION</h2>
          
          <h3 className="text-lg font-medium mb-3">7.1 Internal Review Process</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>All refund requests are reviewed by our customer success team</li>
            <li>Complex cases may be escalated to management for final decision</li>
            <li>We strive to resolve all refund requests fairly and promptly</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">7.2 Appeals Process</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            If your refund request is denied, you may:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Request a detailed explanation of the denial</li>
            <li>Provide additional information or documentation</li>
            <li>Request a review by a senior team member</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">7.3 External Dispute Resolution</h3>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>For unresolved disputes, you may contact your payment provider</li>
            <li>Credit card chargebacks should be a last resort after exhausting our internal process</li>
            <li>Legal disputes will be handled according to our Terms of Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. CONTACT INFORMATION</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            For refund requests, questions, or concerns about this Refund Policy, please contact us:
          </p>
          <div className="mb-4">
            <p className="text-foreground"><strong>Email:</strong> contact@reebews.com</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 font-medium">Postal Address:</p>
            <p className="text-foreground">
              Reebews<br />
              c/o The Cybershop India<br />
              #4/7, Venkataryan Lane<br />
              ParkTown, Chennai - 600 003<br />
              Tamil Nadu, India
            </p>
          </div>
          <p className="text-gray-700">
            <strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. POLICY UPDATES</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We reserve the right to update this Refund Policy at any time. Changes will be effective immediately upon 
            posting on our platform. We will notify users of significant changes through:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Email notifications to registered users</li>
            <li>Platform notifications and announcements</li>
            <li>Updates to the "Last Updated" date at the top of this policy</li>
          </ul>
          <p className="text-foreground leading-relaxed">
            Your continued use of our services after policy updates constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">10. LEGAL COMPLIANCE</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            This Refund Policy is designed to comply with applicable consumer protection laws and regulations. 
            Our refund practices are fair, transparent, and in accordance with:
          </p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>Indian Consumer Protection Act</li>
            <li>Payment gateway regulations (Razorpay, PayPal)</li>
            <li>International consumer protection standards</li>
            <li>Industry best practices for SaaS services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">11. IMPORTANT NOTES</h2>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>Refunds are processed in the original currency of purchase</li>
            <li>Currency conversion fees (if applicable) are borne by the customer</li>
            <li>Processing fees charged by payment gateways may be deducted from refund amounts</li>
            <li>Refunds do not include any third-party costs or fees incurred by the customer</li>
            <li>This policy does not affect your statutory rights under applicable consumer protection laws</li>
          </ul>
        </section>

        <hr className="my-8 border-gray-300" />
        
        <p className="text-sm text-muted-foreground italic">
          This Refund Policy is effective as of the date listed above and governs all refund requests for Reebews services.
        </p>
      </div>
      </div>
      <Footer />
    </main>
  );
}