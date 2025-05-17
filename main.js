import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#glitchCanvas'),
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Text geometry
const loader = new THREE.FontLoader();
const textGeometry = new THREE.TextGeometry('N.W.A', {
    font: await loader.loadAsync('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'),
    size: 1,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
});

// Center the text
textGeometry.computeBoundingBox();
const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
textGeometry.translate(-textWidth / 2, -0.5, 0);

// Material and mesh
const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0x666666,
    shininess: 30
});
const textMesh = new THREE.Mesh(textGeometry, material);
scene.add(textMesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

camera.position.z = 5;

// Glitch animation
let glitchTime = 0;
const glitchDuration = 1; // 1 second
const originalVertices = textGeometry.attributes.position.array.slice();

function glitchAnimation() {
    if (glitchTime < glitchDuration) {
        const vertices = textGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i] = originalVertices[i] + (Math.random() - 0.5) * 0.1;
            vertices[i + 1] = originalVertices[i + 1] + (Math.random() - 0.5) * 0.1;
            vertices[i + 2] = originalVertices[i + 2] + (Math.random() - 0.5) * 0.1;
        }
        textGeometry.attributes.position.needsUpdate = true;
        glitchTime += 0.016; // Approximately 60fps
    } else if (glitchTime < glitchDuration + 0.016) {
        // Reset vertices to original positions
        const vertices = textGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i] = originalVertices[i];
        }
        textGeometry.attributes.position.needsUpdate = true;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    glitchAnimation();
    textMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Typewriter effect
const headline = document.getElementById('headline');
const text = 'no weak algorithms.';
let charIndex = 0;

function typeWriter() {
    if (charIndex < text.length) {
        headline.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 60);
    } else {
        // Show button after text is complete
        const button = document.getElementById('proveButton');
        button.style.opacity = '1';
        button.classList.add('pulse');
    }
}

// Start animations
animate();
typeWriter(); 