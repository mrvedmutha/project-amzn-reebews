import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function CookiesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">COOKIE POLICY</h1>
      
      <p className="text-sm text-gray-600 mb-8">
        <strong>Last Updated:</strong> 17-July-2025
      </p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. INTRODUCTION</h2>
          <p className="text-gray-700 leading-relaxed">
            This Cookie Policy explains how Reebews ("we," "our," or "us") uses cookies and similar tracking technologies 
            on our review platform service ("Service"). This policy should be read together with our Privacy Policy and 
            Terms of Service.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By using our Service, you consent to the use of cookies as described in this policy. If you do not agree with 
            our use of cookies, you should adjust your browser settings or discontinue use of our Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. WHAT ARE COOKIES?</h2>
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit a 
            website. They are widely used to make websites work more efficiently and to provide information to website 
            owners about how users interact with their sites.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Cookies contain information that is transferred to your device's hard drive and stored there. They allow us to 
            recognize your device and remember certain information about your preferences or past actions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. TYPES OF COOKIES WE USE</h2>
          
          <h3 className="text-lg font-medium mb-3">3.1 Essential Cookies</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            These cookies are necessary for our platform to function properly and cannot be disabled in our systems. 
            They are usually set in response to actions you take that require services, such as logging in or filling out forms.
          </p>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Purpose:</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>User authentication and security</li>
              <li>Session management</li>
              <li>Platform functionality</li>
              <li>Security features and fraud prevention</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Legal Basis:</strong> Legitimate interest for providing the service you requested.
          </p>
          
          <h3 className="text-lg font-medium mb-3">3.2 Analytics Cookies</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            These cookies help us understand how visitors interact with our platform by collecting and reporting 
            information anonymously.
          </p>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Services We Use:</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Google Analytics:</strong> Tracks website usage, visitor behavior, and performance metrics</li>
              <li><strong>Microsoft Clarity:</strong> Records user sessions and provides heatmaps and user interaction insights</li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Information Collected:</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Pages visited and time spent on pages</li>
              <li>Click patterns and navigation paths</li>
              <li>Device and browser information</li>
              <li>Geographic location (country/city level)</li>
              <li>User flow and conversion data</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Legal Basis:</strong> Legitimate interest for improving our services and user experience.
          </p>
          
          <h3 className="text-lg font-medium mb-3">3.3 Marketing and Advertising Cookies</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            These cookies may be used to deliver advertisements and track the effectiveness of marketing campaigns. 
            We may implement these in the future.
          </p>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Potential Uses:</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Personalized advertising</li>
              <li>Campaign effectiveness measurement</li>
              <li>Cross-platform marketing attribution</li>
              <li>Social media integration</li>
              <li>Retargeting and remarketing</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed">
            <strong>Legal Basis:</strong> Consent (where required) or legitimate interest for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. HOW WE USE COOKIES</h2>
          
          <h3 className="text-lg font-medium mb-3">4.1 Platform Functionality</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Maintaining user sessions and login status</li>
            <li>Remembering user preferences and settings</li>
            <li>Enabling platform features and tools</li>
            <li>Providing secure access to your account</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">4.2 Performance and Analytics</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Measuring platform performance and load times</li>
            <li>Understanding user behavior and usage patterns</li>
            <li>Identifying popular features and content</li>
            <li>Optimizing user experience and interface design</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">4.3 Security and Fraud Prevention</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Protecting against unauthorized access</li>
            <li>Preventing automated attacks and spam</li>
            <li>Detecting suspicious activity</li>
            <li>Maintaining platform integrity</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">4.4 Service Improvement</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Analyzing user feedback and behavior</li>
            <li>Testing new features and improvements</li>
            <li>Monitoring platform errors and issues</li>
            <li>Enhancing overall service quality</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. THIRD-PARTY COOKIES</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We work with trusted third-party service providers who may place cookies on your device:
          </p>
          
          <h3 className="text-lg font-medium mb-3">5.1 Google Analytics</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><strong>Purpose:</strong> Website analytics and performance tracking</li>
            <li><strong>Data Collected:</strong> Anonymous usage statistics, user behavior patterns</li>
            <li><strong>Privacy Policy:</strong> https://policies.google.com/privacy</li>
            <li><strong>Opt-Out:</strong> https://tools.google.com/dlpage/gaoptout</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">5.2 Microsoft Clarity</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><strong>Purpose:</strong> User experience analysis and session recording</li>
            <li><strong>Data Collected:</strong> User interactions, click patterns, page navigation</li>
            <li><strong>Privacy Policy:</strong> https://privacy.microsoft.com/en-us/privacystatement</li>
            <li><strong>Opt-Out:</strong> Available through browser settings</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">5.3 Clerk Authentication</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><strong>Purpose:</strong> User authentication and account management</li>
            <li><strong>Data Collected:</strong> Authentication tokens, session information</li>
            <li><strong>Privacy Policy:</strong> https://clerk.com/privacy</li>
            <li><strong>Control:</strong> Managed through account settings</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">5.4 Future Marketing Partners</h3>
          <p className="text-gray-700 leading-relaxed">
            We may integrate with additional marketing and advertising platforms in the future. When we do, we will 
            update this policy and provide appropriate notice and consent mechanisms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. COOKIE DURATION</h2>
          
          <h3 className="text-lg font-medium mb-3">6.1 Session Cookies</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><strong>Duration:</strong> Deleted when you close your browser</li>
            <li><strong>Purpose:</strong> Temporary functionality during your visit</li>
            <li><strong>Examples:</strong> Login status, form data, security tokens</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">6.2 Persistent Cookies</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><strong>Duration:</strong> Remain on your device for a specified period</li>
            <li><strong>Purpose:</strong> Remember preferences and settings across visits</li>
            <li><strong>Expiration:</strong> Varies from days to years depending on the cookie type</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">6.3 Specific Cookie Lifespans</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Authentication Cookies:</strong> 30 days or until logout</li>
            <li><strong>Preference Cookies:</strong> 1 year</li>
            <li><strong>Analytics Cookies:</strong> 2 years (Google Analytics default)</li>
            <li><strong>Security Cookies:</strong> Session-based or 24 hours</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. MANAGING YOUR COOKIE PREFERENCES</h2>
          
          <h3 className="text-lg font-medium mb-3">7.1 Browser Settings</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            You can control cookies through your browser settings:
          </p>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              <strong>Chrome:</strong> Settings {' > '} Privacy and Security {' > '} Cookies and other site data
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Firefox:</strong> Settings {' > '} Privacy & Security {' > '} Cookies and Site Data
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Safari:</strong> Preferences {' > '} Privacy {' > '} Cookies and website data
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Edge:</strong> Settings {' > '} Cookies and site permissions {' > '} Cookies and site data
            </p>
          </div>
          
          <h3 className="text-lg font-medium mb-3">7.2 Disabling Cookies</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            You can choose to disable cookies, but this may affect platform functionality:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>You may not be able to log in or access certain features</li>
            <li>Your preferences and settings may not be saved</li>
            <li>Platform performance may be reduced</li>
            <li>Some features may not work properly</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">7.3 Analytics Opt-Out</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            You can opt out of analytics tracking:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Google Analytics:</strong> Use the Google Analytics Opt-out Browser Add-on</li>
            <li><strong>Microsoft Clarity:</strong> Disable through browser privacy settings</li>
            <li><strong>Platform Settings:</strong> We may provide opt-out options in your account settings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. MOBILE APPLICATIONS</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            If you use our mobile applications, similar technologies may be used:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Mobile Analytics:</strong> Usage tracking and performance monitoring</li>
            <li><strong>Push Notifications:</strong> Notification preferences and delivery</li>
            <li><strong>App Performance:</strong> Crash reporting and error tracking</li>
            <li><strong>User Experience:</strong> Feature usage and interface optimization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. UPDATES TO THIS POLICY</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We may update this Cookie Policy from time to time to reflect:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li>Changes in cookie usage</li>
            <li>New third-party integrations</li>
            <li>Legal or regulatory updates</li>
            <li>Service improvements and new features</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-3">
            When we make significant changes, we will:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Update the "Last Updated" date</li>
            <li>Notify users through email or platform notifications</li>
            <li>Provide clear information about the changes</li>
            <li>Obtain new consent where required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">10. YOUR RIGHTS</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Under applicable privacy laws, you may have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Access:</strong> Request information about cookies we use</li>
            <li><strong>Control:</strong> Manage your cookie preferences</li>
            <li><strong>Withdraw Consent:</strong> Opt out of non-essential cookies</li>
            <li><strong>Object:</strong> Object to certain cookie processing</li>
            <li><strong>Portability:</strong> Request your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">11. CONTACT INFORMATION</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            If you have questions about our use of cookies or this Cookie Policy, please contact us:
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
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">12. LEGAL COMPLIANCE</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            This Cookie Policy is designed to comply with applicable laws and regulations, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Indian Information Technology Act and rules</li>
            <li>General Data Protection Regulation (GDPR) for EU users</li>
            <li>California Consumer Privacy Act (CCPA) for California users</li>
            <li>Other applicable privacy and data protection laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">13. CONSENT</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            By clicking "Accept" on our cookie banner or continuing to use our Service, you consent to the use of cookies 
            as described in this policy. You can withdraw your consent at any time by adjusting your browser settings or 
            contacting us.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For essential cookies required for platform functionality, we rely on legitimate interest rather than consent, 
            as these are necessary to provide the service you have requested.
          </p>
        </section>

        <hr className="my-8 border-gray-300" />
        
        <p className="text-sm text-gray-600 italic">
          This Cookie Policy is effective as of the date listed above and governs the use of cookies and similar 
          technologies by Reebews.
        </p>
      </div>
      </div>
      <Footer />
    </main>
  );
}