
import { Layout } from '@/components/Layout';
import { m } from 'framer-motion';

const TermsOfService = () => {
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
        <m.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <m.h1 
            className="text-4xl font-bold mb-6"
            variants={fadeInUp}
          >
            Terms of Service
          </m.h1>
          
          <div className="prose prose-lg max-w-none">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Kids AI Resources website, you agree to be bound by these Terms of 
              Service and all applicable laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using or accessing this site.
            </p>
            
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily view the materials on Kids AI Resources's website for 
              personal, non-commercial use only. This is the grant of a license, not a transfer of title, and 
              under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            <p>
              This license shall automatically terminate if you violate any of these restrictions and may be 
              terminated by Kids AI Resources at any time.
            </p>
            
            <h2>3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and 
              current at all times. Failure to do so constitutes a breach of the Terms, which may result in 
              immediate termination of your account.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the service and for any 
              activities or actions under your password. You agree not to disclose your password to any third party.
            </p>
            
            <h2>4. User Contributions</h2>
            <p>
              Our service may allow you to post, link, store, share and otherwise make available certain information, 
              text, graphics, videos, or other material. You are responsible for the content that you post, including 
              its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, 
              and distribute such content on and through our service.
            </p>
            
            <h2>5. Reviews and Ratings</h2>
            <p>
              When posting reviews or ratings, you agree to:
            </p>
            <ul>
              <li>Provide honest and accurate assessments based on your personal experience</li>
              <li>Not post false or misleading information</li>
              <li>Not post content that is defamatory, abusive, or harmful to others</li>
              <li>Not post content that violates intellectual property rights</li>
            </ul>
            <p>
              We reserve the right to remove reviews that violate these terms.
            </p>
            
            <h2>6. Third-Party Links</h2>
            <p>
              Our service may contain links to third-party websites or services that are not owned or controlled 
              by Kids AI Resources. We have no control over, and assume no responsibility for, the content, 
              privacy policies, or practices of any third-party websites or services.
            </p>
            
            <h2>7. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any 
              reason whatsoever, including without limitation if you breach the Terms.
            </p>
            
            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall Kids AI Resources, nor its directors, employees, partners, agents, suppliers, or 
              affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including 
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your access to or use of or inability to access or use the service</li>
              <li>Any conduct or content of any third party on the service</li>
              <li>Any content obtained from the service</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
            </ul>
            
            <h2>9. Disclaimer</h2>
            <p>
              Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. 
              The service is provided without warranties of any kind, whether express or implied.
            </p>
            
            <h2>10. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws, without regard to its conflict 
              of law provisions.
            </p>
            
            <h2>11. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing 
              to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
            
            <h2>12. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              terms@kidsairesources.com
            </p>
          </div>
        </m.div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
