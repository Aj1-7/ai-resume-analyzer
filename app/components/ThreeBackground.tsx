import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS background');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create particle material with custom shader
    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.0;
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          vec3 color1 = vec3(0.5, 0.3, 1.0); // Purple
          vec3 color2 = vec3(0.3, 0.5, 1.0); // Blue
          vec3 color3 = vec3(1.0, 0.3, 0.5); // Pink
          
          float t = sin(vPosition.x * 0.5 + vPosition.y * 0.3 + vPosition.z * 0.2) * 0.5 + 0.5;
          vec3 finalColor = mix(color1, color2, t);
          finalColor = mix(finalColor, color3, sin(t * 3.14159) * 0.5 + 0.5);
          
          gl_FragColor = vec4(finalColor, 0.8 * (1.0 - distance * 2.0));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating geometric shapes
    const createFloatingShape = (geometry: THREE.BufferGeometry, color: number, scale: number = 1) => {
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.1,
        wireframe: true
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.setScalar(scale);
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(mesh);
      return mesh;
    };

    const shapes: THREE.Mesh[] = [];
    
    // Add various geometric shapes
    shapes.push(createFloatingShape(new THREE.TetrahedronGeometry(1), 0x6366f1, 2));
    shapes.push(createFloatingShape(new THREE.OctahedronGeometry(1), 0x8b5cf6, 1.5));
    shapes.push(createFloatingShape(new THREE.IcosahedronGeometry(1), 0x10b981, 1.8));
    shapes.push(createFloatingShape(new THREE.TorusGeometry(0.5, 0.2, 8, 16), 0xf59e0b, 1.2));
    shapes.push(createFloatingShape(new THREE.SphereGeometry(0.8, 8, 8), 0xef4444, 1.5));

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.002;

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 + index * 0.001;
        shape.rotation.y += 0.003 + index * 0.002;
        shape.rotation.z += 0.002 + index * 0.001;
        
        // Floating motion
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        shape.position.x += Math.cos(Date.now() * 0.001 + index) * 0.001;
      });

      // Camera movement based on mouse
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      shapes.forEach(shape => {
        shape.geometry.dispose();
        (shape.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%)',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  );
};

export default ThreeBackground; 