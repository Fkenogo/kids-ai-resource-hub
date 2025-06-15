
import { Layout } from '@/components/Layout';
import { m } from 'framer-motion';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <m.div 
          className="max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <m.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            variants={fadeInUp}
          >
            About <span className="gradient-text">Kids AI Resources</span>
          </m.h1>
          
          <m.p 
            className="text-xl mb-8 text-muted-foreground"
            variants={fadeInUp}
          >
            Our mission is to help parents discover the best AI learning resources for their children.
          </m.p>
          
          <m.div 
            className="prose prose-lg max-w-none"
            variants={fadeInUp}
          >
            <h2>Our Mission</h2>
            <p>
              In today's rapidly evolving technological landscape, understanding artificial intelligence
              is becoming as essential as reading and writing. We believe that introducing children to AI
              concepts early can help them navigate and shape the future with confidence and creativity.
            </p>
            
            <p>
              That's why we created this platform—to bridge the gap between cutting-edge AI education
              and parents looking to give their children the best learning opportunities. We've curated
              a comprehensive directory of resources ranging from interactive games to structured courses,
              all designed to make AI accessible and engaging for young minds.
            </p>
            
            <h2>What We Offer</h2>
            <ul>
              <li>
                <strong>Curated Resources:</strong> Each resource in our directory is carefully selected
                and evaluated for educational value, age-appropriateness, and engagement.
              </li>
              <li>
                <strong>Community Reviews:</strong> Real feedback from parents and educators helps you
                find the most effective resources for your child's learning style.
              </li>
              <li>
                <strong>Age-Appropriate Filtering:</strong> Easily find resources that match your child's
                developmental stage and interests.
              </li>
              <li>
                <strong>Learning Outcome Focus:</strong> We highlight the specific skills and knowledge
                each resource helps develop.
              </li>
            </ul>
            
            <h2>The Future of AI Education</h2>
            <p>
              As AI continues to transform our world, we're committed to evolving our platform to meet
              the changing educational needs of children. We believe in fostering a positive, ethical
              approach to AI technology that emphasizes human creativity, critical thinking, and
              responsible innovation.
            </p>
            
            <p>
              By introducing children to AI concepts early and thoughtfully, we're helping prepare them
              not just to adapt to technological change, but to actively shape it for the better.
            </p>
            
            <h2>Join Our Community</h2>
            <p>
              Whether you're a parent looking for resources, an educator sharing insights, or an AI
              enthusiast with expertise to offer, we welcome you to our community. Together, we can
              ensure the next generation has the tools they need to thrive in an AI-enhanced world.
            </p>
          </m.div>
        </m.div>
      </div>
    </Layout>
  );
};

export default About;
