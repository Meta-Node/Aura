uniform sampler2D uTexture;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec4 color = vec4(146./255., 182./255., 216./255., 0.8);
  float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );
  gl_FragColor = color * intensity;
}