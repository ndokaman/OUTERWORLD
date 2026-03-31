const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer();
const page = document.getElementById("shader-bg");
renderer.setSize(window.innerWidth, window.innerHeight);
page.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2);


const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
 
  void main() {
    vec2 uv = (gl_FragCoord.xy / u_resolution) - 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    // wobble coordinates
    uv.x += sin(uv.y * 10.0 + u_time) * 0.05;
    uv.y += sin(uv.x * 10.0 + u_time) * 0.05;

    float dist = length(uv);

    // multiple ring layers at different frequencies
    float rings1 = sin(dist * 20.5 - u_time);
    float rings2 = sin(dist * 20.5 + u_time * 1.1);
    float rings3 = sin(dist * 20.5 - u_time * 0.3);
    float rings4 = sin(dist * 20.5 - u_time * 0.2);
    float rings5 = sin(dist * 45.4- u_time * 1.3);
    float rings6 = sin(dist * 60.5 - u_time * 1.6);
    
    float rings = (rings1 + rings2 + rings3 + rings4 + rings5 + rings6) / 50.0;
    rings = rings * 0.2 + 0.5;

    // color shifts based on distance and time
    float r = 0.0;
    float g = rings * (sin(dist * 7.0 + u_time * 0.3) * 0.2 + 0.25);
    float b = rings * (sin(dist * 3.0 - u_time * 0.5) * 0.2 + 0.35);

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const uniforms = {
  u_time: { value: 0.0 },
  u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
};

const material = new THREE.ShaderMaterial({

  fragmentShader: fragmentShader,
  uniforms: uniforms
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
});

// u_time.value ties naimation speed to frame rate, not elapsed time.
// diff browsers run at diff frame rates
// to solve this use a real clock that three.js has built in

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  uniforms.u_time.value = clock.getElapsedTime(); // REAL seconds not frame count
  renderer.render(scene, camera);
}
animate();

