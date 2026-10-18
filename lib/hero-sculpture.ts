type Point = [number, number, number];
const normalise = (p: Point): Point => { const length = Math.hypot(...p) || 1; return p.map(v => v / length) as Point; };
const cross = (a: Point, b: Point): Point => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const subtract = (a: Point, b: Point): Point => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];

/** Three closed, tapered ribbons. Shared by the live mesh and static fallback. */
export function ribbonPoint(u: number, v: number, layer: number): Point {
  const twist = (u - .5) * Math.PI * 1.7;
  const taper = Math.pow(Math.max(.001, Math.sin(Math.PI * u)), .28);
  const wide = Math.cos(v) * .62 * taper;
  const thin = Math.sin(v) * .055 * taper;
  return [
    (u - .5) * 9,
    Math.sin(u * Math.PI * 2) * .22 + (layer - 1) * .58 + wide * Math.cos(twist) - thin * Math.sin(twist),
    Math.cos(u * Math.PI * 2) * .4 + (layer - 1) * .18 + wide * Math.sin(twist) + thin * Math.cos(twist),
  ];
}

export function createRibbonMesh(segments = 112, sides = 16) {
  const vertices: number[] = [];
  const vertex = (u: number, v: number, layer: number) => {
    const p = ribbonPoint(u, v, layer);
    const du = subtract(ribbonPoint(Math.min(1, u+.0001), v, layer), ribbonPoint(Math.max(0, u-.0001), v, layer));
    const dv = subtract(ribbonPoint(u, v+.0001, layer), ribbonPoint(u, v-.0001, layer));
    const n = normalise(cross(du, dv));
    vertices.push(...p, ...n, layer, Math.abs(Math.cos(v)));
  };
  for (let layer = 0; layer < 3; layer++) for (let i = 0; i < segments; i++) for (let j = 0; j < sides; j++) {
    const u = i/segments, next = (i+1)/segments, v = j/sides*Math.PI*2, end = (j+1)/sides*Math.PI*2;
    vertex(u,v,layer); vertex(next,v,layer); vertex(u,end,layer);
    vertex(u,end,layer); vertex(next,v,layer); vertex(next,end,layer);
  }
  return new Float32Array(vertices);
}

export const SCULPTURE_VERTEX = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aMaterial;
uniform vec2 uPointer;
uniform float uTime;
uniform float uAspect;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vMaterial;
void main() {
  float yaw = -.24 + sin(uTime*.3)*.10 + uPointer.x*.18;
  float pitch = .42 + uPointer.y*.12;
  float roll = -.14;
  mat3 ry = mat3(cos(yaw),0.,-sin(yaw), 0.,1.,0., sin(yaw),0.,cos(yaw));
  mat3 rx = mat3(1.,0.,0., 0.,cos(pitch),sin(pitch), 0.,-sin(pitch),cos(pitch));
  mat3 rz = mat3(cos(roll),sin(roll),0., -sin(roll),cos(roll),0., 0.,0.,1.);
  mat3 rotation = rz*rx*ry;
  vec3 p = aPosition;
  p.y += (aMaterial.x-1.) * sin(uTime*.55)*.09;
  p = rotation*p;
  float extent = max(2.1, 5.15/uAspect);
  float perspective = 1.+p.z*.055;
  gl_Position = vec4(p.x/(extent*uAspect)*perspective, p.y/extent*perspective, -p.z/8., 1.);
  vPosition = p;
  vNormal = rotation*aNormal;
  vMaterial = aMaterial;
}`;

export const SCULPTURE_FRAGMENT = `
precision mediump float;
uniform vec2 uPointer;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vMaterial;
void main() {
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 light = normalize(vec3(-.4+uPointer.x*.35, .85, 1.4));
  vec3 view = normalize(vec3(0.,0.,8.)-vPosition);
  float diffuse = max(dot(n,light),0.);
  float sheen = pow(max(dot(n,normalize(light+view)),0.),45.);
  float rim = pow(1.-max(dot(n,view),0.),3.);
  vec3 ink = mix(vec3(.035,.15,.30),vec3(.17,.43,.72),vMaterial.x*.25);
  vec3 color = ink*(.55+diffuse*.85);
  color += vec3(.66,.82,.94)*sheen*.9;
  color = mix(color,vec3(.62,.79,.91),rim*.48);
  float edge = smoothstep(.976,1.,vMaterial.y);
  if (vMaterial.x > 1.5) color = mix(color,vec3(.72,.86,.36)*(.65+diffuse*.4),edge*.85);
  gl_FragColor = vec4(color,1.);
}`;
