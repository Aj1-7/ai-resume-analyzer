import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface FloatingCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const FloatingCard3D = ({ children, className = '', intensity = 0.1 }: FloatingCard3DProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !cardRef.current) return;

    const canvas = canvasRef.current;
    const card = cardRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create a subtle geometric pattern
    const geometry = new THREE.PlaneGeometry(4, 4, 8, 8);
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          vec2 uv = vUv;
          
          // Create a subtle grid pattern
          float grid = 0.0;
          grid += step(0.95, fract(uv.x * 10.0)) * 0.1;
          grid += step(0.95, fract(uv.y * 10.0)) * 0.1;
          
          // Add some animated waves
          float wave = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time) * 0.05;
          
          // Create gradient
          vec3 color1 = vec3(0.4, 0.2, 0.8); // Purple
          vec3 color2 = vec3(0.2, 0.4, 0.8); // Blue
          vec3 finalColor = mix(color1, color2, uv.x + uv.y);
          
          float alpha = 0.1 + grid + wave;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      uniforms: {
        time: { value: 0 }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX = ((event.clientX - centerX) / (rect.width / 2)) * intensity;
      mouseY = ((event.clientY - centerY) / (rect.height / 2)) * intensity;
      
      targetRotationX = mouseY;
      targetRotationY = mouseX;
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      targetRotationX = 0;
      targetRotationY = 0;
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Smooth rotation interpolation
      mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.1;
      mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.1;

      // Update shader time uniform
      material.uniforms.time.value += 0.01;

      // Add subtle floating motion
      if (isHovered) {
        mesh.position.y = Math.sin(Date.now() * 0.003) * 0.1;
      } else {
        mesh.position.y = Math.sin(Date.now() * 0.002) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const rect = card.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      camera.aspect = canvas.width / canvas.height;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.width, canvas.height);
    };

    // Initial resize
    handleResize();

    // Cleanup
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [intensity]);

  return (
    <div 
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default FloatingCard3D; 