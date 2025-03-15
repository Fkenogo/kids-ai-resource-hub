
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl font-bold mb-6"
            variants={fadeInUp}
          >
            Privacy Policy
          </motion.h1>
          
          <div className="prose prose-lg max-w-none">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to Kids AI Resources ("we," "our," or "us"). We are committed to protecting your privacy 
              and the privacy of your children. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website and use our services.
            </p>
            
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Create an account</li>
              <li>Sign up for our newsletter</li>
              <li>Participate in contests or surveys</li>
              <li>Submit reviews or comments</li>
              <li>Contact us</li>
            </ul>
            <p>This information may include:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Social media login information</li>
              <li>Profile information (such as age ranges of your children)</li>
            </ul>
            
            <h3>Information About Children</h3>
            <p>
              We do not knowingly collect personal information from children under 13. Our platform is 
              designed for parents, educators, and guardians. If you are under 13, please do not provide 
              any personal information on this site.
            </p>
            
            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect certain information about your device, 
              including:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Referring URLs</li>
              <li>Pages visited</li>
              <li>Time spent on pages</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions</li>
              <li>Send you administrative information</li>
              <li>Respond to your comments or inquiries</li>
              <li>Personalize your experience</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Protect against unauthorized access</li>
            </ul>
            
            <h2>4. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who assist us in operating our website</li>
              <li>Analytics partners</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside parties 
              unless we provide you with advance notice.
            </p>
            
            <h2>5. Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information. However, 
              no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2>6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect information about your browsing 
              activities. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            
            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Objection to certain processing</li>
              <li>Data portability</li>
            </ul>
            
            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              privacy@kidsairesources.com
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
