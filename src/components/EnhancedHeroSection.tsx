
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { m } from 'framer-motion';

const EnhancedHeroSection = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Responsive handling
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Adjust particle count based on device performance
    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 150 : 300;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      sizes[i] = Math.random() * 0.1 + 0.03;
      
      // Purple color scheme matching our theme
      colors[i * 3] = 0.6 + Math.random() * 0.4;     // R
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.3; // G  
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Shader material for particles
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 d = gl_PointCoord - 0.5;
          float r = dot(d, d);
          float alpha = smoothstep(0.5, 0.0, r);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Connection lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8b5cf6, // Purple matching our theme
      transparent: true,
      opacity: 0.15,
    });
    const lines: THREE.Line[] = [];

    // Create connections between nearby particles
    for (let i = 0; i < particlesCount; i += 3) { // Reduce iterations for performance
      for (let j = i + 3; j < Math.min(i + 12, particlesCount); j += 3) {
        const p1 = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        const p2 = new THREE.Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
        
        if (p1.distanceTo(p2) < 2.5) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          lines.push(line);
          scene.add(line);
        }
      }
    }

    camera.position.z = 5;

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (particles) {
        particles.rotation.y += 0.0008;
        particles.rotation.x += 0.0003;
      }
      
      lines.forEach(line => {
        line.rotation.y += 0.0008;
        line.rotation.x += 0.0003;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      lineMaterial.dispose();
      lines.forEach(line => line.geometry.dispose());
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-800 overflow-hidden">
      {/* Three.js Canvas Background */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10 min-h-screen flex items-center">
          <m.div 
            className="max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <m.div variants={fadeInUp}>
              <Badge className="mb-6 bg-purple-500/20 text-purple-200 border-purple-400/30 text-sm py-2 px-4 backdrop-blur-sm">
                ✨ AI-Powered Learning Platform
              </Badge>
            </m.div>
            
            <m.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-8 text-white"
              variants={fadeInUp}
            >
              Discover the best{' '}
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 text-transparent bg-clip-text animate-pulse">
                AI learning resources
              </span>{' '}
              for your children
            </m.h1>
            
            <m.p 
              className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl leading-relaxed"
              variants={fadeInUp}
            >
              A curated directory of educational tools, courses, games, and materials to help kids learn about artificial intelligence in an engaging and age-appropriate way.
            </m.p>
            
            <m.div 
              className="flex flex-wrap gap-4"
              variants={fadeInUp}
            >
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/resources">Explore Resources</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-purple-400 text-purple-200 hover:bg-purple-600/20 hover:text-white px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
