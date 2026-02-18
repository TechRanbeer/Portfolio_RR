
import React, { useRef, useEffect } from 'react';

const CloudBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const vsSource = `#version 300 es
      in vec4 position;
      void main() { gl_Position = position; }
    `;

    const fsSource = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 resolution;
      uniform float time;
      uniform float scroll;

      float rnd(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(rnd(i), rnd(i + vec2(1, 0)), u.x),
                   mix(rnd(i + vec2(0, 1)), rnd(i + vec2(1, 1)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        uv.y += scroll * 0.0002; // React to scroll
        
        float n = fbm(uv * 3.0 + time * 0.05);
        
        vec3 color1 = vec3(0.02, 0.05, 0.1); // Deep Navy
        vec3 color2 = vec3(0.05, 0.15, 0.25); // Cyan depth
        
        vec3 finalColor = mix(color1, color2, n);
        
        // Add some "light" highlights
        finalColor += pow(n, 4.0) * 0.15;
        
        fragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'resolution');
    const timeLoc = gl.getUniformLocation(program, 'time');
    const scrollLoc = gl.getUniformLocation(program, 'scroll');

    const render = (now: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, now * 0.001);
      gl.uniform1f(scrollLoc, scrollY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(render);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-40"
    />
  );
};

export default CloudBackground;