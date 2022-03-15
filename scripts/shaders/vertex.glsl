varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec2 vUv = uv;
  vNormal = normalize( normalMatrix * normal );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}