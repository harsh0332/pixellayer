"use client";

import { useEffect, useRef, useState } from "react";
import { createRibbonMesh, SCULPTURE_FRAGMENT, SCULPTURE_VERTEX } from "@/lib/hero-sculpture";
import { useStudioMotion } from "./StudioMotion";

export function HeroSculpture() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const controller = useRef<((moving: boolean) => void) | null>(null);
  const { paused, reduced } = useStudioMotion();
  const [revision, setRevision] = useState(0);
  const motion = useRef(false);

  useEffect(() => {
    motion.current = !paused && !reduced;
    controller.current?.(motion.current);
  }, [paused, reduced]);

  useEffect(() => {
    const surface = canvas.current, container = stage.current;
    if (!surface || !container) return;
    let gl: WebGLRenderingContext | null;
    try { gl = surface.getContext("webgl", { alpha: true, antialias: true, powerPreference: "low-power" }); } catch { return; }
    if (!gl) return;
    const context = gl;
    const compile = (type: number, source: string) => {
      const shader = context.createShader(type);
      if (!shader) return null;
      context.shaderSource(shader, source); context.compileShader(shader);
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) { context.deleteShader(shader); return null; }
      return shader;
    };
    const vertex = compile(context.VERTEX_SHADER, SCULPTURE_VERTEX), fragment = compile(context.FRAGMENT_SHADER, SCULPTURE_FRAGMENT);
    const program = context.createProgram();
    if (!vertex || !fragment || !program) {
      if (vertex) context.deleteShader(vertex); if (fragment) context.deleteShader(fragment); if (program) context.deleteProgram(program);
      return;
    }
    context.attachShader(program, vertex); context.attachShader(program, fragment); context.linkProgram(program);
    context.deleteShader(vertex); context.deleteShader(fragment);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) { context.deleteProgram(program); return; }
    const mesh = createRibbonMesh();
    const buffer = context.createBuffer();
    if (!buffer) { context.deleteProgram(program); return; }
    context.useProgram(program); context.bindBuffer(context.ARRAY_BUFFER, buffer); context.bufferData(context.ARRAY_BUFFER, mesh, context.STATIC_DRAW);
    for (const [name, size, offset] of [["aPosition",3,0],["aNormal",3,12],["aMaterial",2,24]] as const) {
      const location = context.getAttribLocation(program,name);
      context.enableVertexAttribArray(location); context.vertexAttribPointer(location,size,context.FLOAT,false,32,offset);
    }
    const uniforms = { time: context.getUniformLocation(program,"uTime"), pointer: context.getUniformLocation(program,"uPointer"), aspect: context.getUniformLocation(program,"uAspect") };
    context.enable(context.DEPTH_TEST); context.clearColor(0,0,0,0);
    let frame = 0, last = 0, time = 0, visible = true, lost = false, aspect = 3, interval = 1000/60;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    const draw = () => {
      if (lost) return;
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
      context.uniform1f(uniforms.time,time); context.uniform2f(uniforms.pointer,x,y); context.uniform1f(uniforms.aspect,aspect);
      context.drawArrays(context.TRIANGLES,0,mesh.length/8);
      container.dataset.ready = "true";
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || !motion.current || lost) return;
      if (!last || now-last >= interval) {
        time += last ? Math.min((now-last)/1000,.06) : 0;
        last = now; x += (targetX-x)*.07; y += (targetY-y)*.07; draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (visible && !document.hidden && !lost) { draw(); if (motion.current) frame = requestAnimationFrame(tick); }
    };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      const mobile = window.innerWidth <= 600;
      const ratio = Math.min(window.devicePixelRatio || 1,mobile ? 1.25 : 1.5);
      surface.width = Math.round(width*ratio); surface.height = Math.round(height*ratio); aspect = width/height;
      interval = 1000/(mobile ? 30 : 60); context.viewport(0,0,surface.width,surface.height); sync();
    };
    const pointer = (event: PointerEvent) => {
      if (!motion.current || event.pointerType !== "mouse") return;
      const rect = container.getBoundingClientRect();
      targetX = Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));
      targetY = Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));
    };
    const leave = () => { targetX = 0; targetY = 0; };
    const loss = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); container.dataset.ready = "false"; };
    const restore = () => setRevision(value => value+1);
    const hero = container.closest("section")!;
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const observer = new ResizeObserver(resize);
    controller.current = sync;
    hero.addEventListener("pointermove",pointer as EventListener); hero.addEventListener("pointerleave",leave);
    surface.addEventListener("webglcontextlost",loss); surface.addEventListener("webglcontextrestored",restore);
    document.addEventListener("visibilitychange",sync);
    observer.observe(container); intersection.observe(container); resize();
    return () => {
      controller.current = null; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
      hero.removeEventListener("pointermove",pointer as EventListener); hero.removeEventListener("pointerleave",leave);
      surface.removeEventListener("webglcontextlost",loss); surface.removeEventListener("webglcontextrestored",restore);
      document.removeEventListener("visibilitychange",sync);
      context.deleteBuffer(buffer); context.deleteProgram(program); container.dataset.ready = "false";
    };
  }, [revision]);

  return <div className="hero-sculpture" ref={stage} data-ready="false" aria-hidden="true">
    {/* The same geometry remains visible when WebGL is unavailable. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/brand/hero-sculpture.webp" alt="" width="1440" height="480" />
    <canvas ref={canvas} />
    <span className="hero-sculpture-shadow" />
  </div>;
}
