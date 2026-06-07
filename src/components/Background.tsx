import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 1,
      color: Math.random() > 0.5 ? '#3BAAB8' : '#F471B5',
      alpha: 0,
      targetAlpha: Math.random() * 0.5 + 0.3,
      fadeSpeed: Math.random() * 0.02 + 0.01,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.02,
      radius_oscillation: Math.random() * 0.5,
      radius_angle: Math.random() * Math.PI * 2,
      radius_speed: 0.03 + Math.random() * 0.02,
    }));

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // Update position with curved motion
        p.angle += p.angleSpeed;
        p.x += p.dx * Math.cos(p.angle);
        p.y += p.dy * Math.sin(p.angle);

        // Bounce off edges with random angle change
        if (p.x < 0 || p.x > canvas.width) {
          p.dx *= -1;
          p.angleSpeed = (Math.random() - 0.5) * 0.02;
        }
        if (p.y < 0 || p.y > canvas.height) {
          p.dy *= -1;
          p.angleSpeed = (Math.random() - 0.5) * 0.02;
        }

        // Oscillate radius
        p.radius_angle += p.radius_speed;
        const currentRadius = p.radius + Math.sin(p.radius_angle) * p.radius_oscillation;

        // Fade in/out effect
        if (p.alpha < p.targetAlpha) {
          p.alpha = Math.min(p.alpha + p.fadeSpeed, p.targetAlpha);
        } else {
          p.targetAlpha = 0;
        }

        if (p.alpha <= 0) {
          p.targetAlpha = Math.random() * 0.5 + 0.3;
          // Randomize position when fully faded out
          if (Math.random() < 0.5) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1;
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[20%] left-1/2 
                     md:w-[900px] md:h-[900px] w-[300px] h-[300px]
                     bg-gradient-to-r from-[#3BAAB8]/20 to-[#F471B5]/20
                     rounded-full blur-[180px] md:blur-[200px]
                     animate-float-glow1 animate-fade-glow1
                     transition-all duration-1000"
        />
        
        <div 
          className="absolute bottom-0 right-0 
                     md:w-[600px] md:h-[600px] w-[200px] h-[200px]
                     bg-[#F471B5]/15 rounded-full 
                     blur-[160px] md:blur-[180px]
                     animate-float-glow2 animate-fade-glow2
                     transition-all duration-1000"
        />
        <div 
          className="absolute top-0 left-0 
                     md:w-[500px] md:h-[500px] w-[150px] h-[150px]
                     bg-[#3BAAB8]/15 rounded-full 
                     blur-[140px] md:blur-[160px]
                     animate-float-glow3 animate-fade-glow3
                     transition-all duration-1000"
        />
      </div>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-60"
      />
    </>
  );
};

export default Background;