export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">PRIVACY POLICY</h1>
      
      <p className="text-sm text-gray-600 mb-8">
        <strong>Last Updated:</strong> 17-July-2025
      </p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. INTRODUCTION</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Reebews ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our review platform service ("Service"). This policy applies 
            to all users of our platform, including businesses that use our services (B2B clients) and individuals 
            who interact with our platform through business implementations.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By using our Service, you agree to the collection and use of information in accordance with this Privacy 
            Policy. If you do not agree with this policy, please do not use our Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. INFORMATION WE COLLECT</h2>
          
          <h3 className="text-lg font-medium mb-3">2.1 Personal Information</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            We collect the following personal information from our users:
          </p>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">For Business Clients (B2B):</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Full name and contact person details</li>
              <li>Business email address</li>
              <li>Business phone number</li>
              <li>Business address</li>
              <li>Business name and registration details</li>
              <li>GSTIN (for Indian businesses)</li>
              <li>Business registration information (for international businesses)</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">For Review Platform Users:</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Name (as provided by reviewers)</li>
              <li>Email address (when provided)</li>
              <li>Review content and ratings</li>
              <li>Timestamp of reviews</li>
              <li>Any additional information voluntarily provided in reviews</li>
            </ul>
          </div>
          
          <h3 className="text-lg font-medium mb-3">2.2 Payment Information</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            Payment and billing information are processed and stored by our third-party payment processors:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><strong>Razorpay</strong> (for Indian users) - PCI DSS compliant</li>
            <li><strong>PayPal</strong> (for international users) - PCI DSS compliant</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            We do not store credit card numbers, payment card details, or other sensitive payment information on our servers.
          </p>
          
          <h3 className="text-lg font-medium mb-3">2.3 Automatically Collected Information</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            We automatically collect certain information when you use our Service:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Usage patterns and analytics data</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. HOW WE COLLECT INFORMATION</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We collect information through:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Direct Input:</strong> Information you provide when registering, creating profiles, or using our services</li>
            <li><strong>Automatic Collection:</strong> Through cookies, analytics tools, and similar technologies</li>
            <li><strong>Third-Party Authentication:</strong> Through Clerk authentication services</li>
            <li><strong>Business Integrations:</strong> When businesses integrate our platform with their systems</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. HOW WE USE YOUR INFORMATION</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We use the collected information for:
          </p>
          
          <h3 className="text-lg font-medium mb-3">4.1 Service Provision and Account Management</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Creating and maintaining user accounts</li>
            <li>Providing access to platform features</li>
            <li>Processing transactions and managing subscriptions</li>
            <li>Authenticating users and maintaining security</li>
            <li>Delivering customer support services</li>
            <li>Sending service-related notifications (password resets, account updates, etc.)</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">4.2 Customer Support</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Responding to inquiries and support requests</li>
            <li>Troubleshooting technical issues</li>
            <li>Providing platform guidance and assistance</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">4.3 Marketing and Communications</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Sending email newsletters (with consent)</li>
            <li>Communicating product updates and new features</li>
            <li>Sending promotional offers and announcements</li>
            <li>Conducting customer satisfaction surveys</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">4.4 Analytics and Service Improvement</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Analyzing platform usage patterns</li>
            <li>Improving our services and user experience</li>
            <li>Developing new features and functionalities</li>
            <li>Monitoring platform performance and security</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">4.5 Legal and Compliance</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Complying with applicable laws and regulations</li>
            <li>Protecting our rights and interests</li>
            <li>Preventing fraud and abuse</li>
            <li>Enforcing our Terms of Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. INFORMATION SHARING AND DISCLOSURE</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          
          <h3 className="text-lg font-medium mb-3">5.1 Service Providers</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            We work with trusted third-party service providers who assist us in operating our platform:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><strong>Payment Processors:</strong> Razorpay (India) and PayPal (international) for payment processing</li>
            <li><strong>Authentication Services:</strong> Clerk for user authentication and account management</li>
            <li><strong>Email Services:</strong> Resend for email communications</li>
            <li><strong>Analytics Services:</strong> Google Analytics and Microsoft Clarity for usage analytics</li>
            <li><strong>Hosting Services:</strong> Hostinger for cloud infrastructure and data storage</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">5.2 Legal Requirements</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            We may disclose your information if required by law or in response to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Valid legal requests from authorities</li>
            <li>Court orders or subpoenas</li>
            <li>Protection of our rights, property, or safety</li>
            <li>Prevention of fraud or illegal activities</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">5.3 Business Transfers</h3>
          <p className="text-gray-700 leading-relaxed">
            In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. COOKIES AND TRACKING TECHNOLOGIES</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We use cookies and similar tracking technologies to enhance your experience:
          </p>
          
          <h3 className="text-lg font-medium mb-3">6.1 Essential Cookies</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Authentication and security cookies</li>
            <li>Session management cookies</li>
            <li>Platform functionality cookies</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">6.2 Analytics Cookies</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Google Analytics for website usage analysis</li>
            <li>Microsoft Clarity for user behavior insights</li>
            <li>Performance monitoring cookies</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">6.3 Marketing and Advertising Cookies</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Future marketing platform integrations</li>
            <li>Advertisement targeting and personalization</li>
            <li>Campaign effectiveness measurement</li>
          </ul>
          
          <p className="text-gray-700 leading-relaxed">
            You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect platform functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. DATA STORAGE AND SECURITY</h2>
          
          <h3 className="text-lg font-medium mb-3">7.1 Data Storage</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your information is stored on secure servers provided by Hostinger in India. We implement appropriate technical and organizational measures to protect your data.
          </p>
          
          <h3 className="text-lg font-medium mb-3">7.2 Security Measures</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure authentication through Clerk</li>
            <li>Access controls and user permissions</li>
            <li>Regular security monitoring and updates</li>
            <li>Industry-standard security practices</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">7.3 Data Retention</h3>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. When you request deletion of your account, we will permanently delete your data without retention.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. YOUR RIGHTS AND CHOICES</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            You have the following rights regarding your personal information:
          </p>
          
          <h3 className="text-lg font-medium mb-3">8.1 Access Rights</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Request access to your personal information</li>
            <li>Obtain a copy of your data in a readable format</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">8.2 Correction Rights</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Update or correct inaccurate information</li>
            <li>Modify your account details and preferences</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">8.3 Deletion Rights</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Request deletion of your account and associated data</li>
            <li>Permanent removal of information from our systems</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">8.4 Marketing Opt-Out</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Unsubscribe from marketing communications</li>
            <li>Opt-out of promotional emails and newsletters</li>
            <li>Manage communication preferences</li>
          </ul>
          
          <p className="text-gray-700 leading-relaxed">
            To exercise these rights, please contact us at contact@reebews.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. INTERNATIONAL DATA TRANSFERS</h2>
          <p className="text-gray-700 leading-relaxed">
            Currently, all data is stored and processed in India through Hostinger's Indian servers. If we expand our services internationally, we will implement appropriate safeguards to protect your data during any international transfers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">10. CHILDREN'S PRIVACY</h2>
          <p className="text-gray-700 leading-relaxed">
            Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">11. THIRD-PARTY LINKS</h2>
          <p className="text-gray-700 leading-relaxed">
            Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you access.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">12. CHANGES TO THIS PRIVACY POLICY</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Posting the updated policy on our platform</li>
            <li>Sending email notifications to registered users</li>
            <li>Updating the "Last Updated" date at the top of this policy</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Your continued use of our Service after any changes constitutes acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">13. CONTACT INFORMATION</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="mb-4">
            <p className="text-gray-700"><strong>Email:</strong> contact@reebews.com</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 font-medium">Postal Address:</p>
            <p className="text-gray-700">
              Reebews<br />
              c/o The Cybershop India<br />
              #4/7, Venkataryan Lane<br />
              ParkTown, Chennai - 600 003<br />
              Tamil Nadu, India
            </p>
          </div>
          <p className="text-gray-700">
            <strong>Response Time:</strong> We will respond to your inquiries within 30 days of receipt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">14. COMPLIANCE AND REGULATORY INFORMATION</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This Privacy Policy is designed to comply with applicable Indian privacy laws and regulations. As our services expand globally, we will update this policy to ensure compliance with relevant international privacy regulations.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For payment processing, we rely on PCI DSS compliant payment processors (Razorpay and PayPal) to ensure the security of payment card information.
          </p>
        </section>

        <hr className="my-8 border-gray-300" />
        
        <p className="text-sm text-gray-600 italic">
          This Privacy Policy is effective as of the date listed above and governs the use of personal information collected by Reebews.
        </p>
      </div>
    </div>
  );
}