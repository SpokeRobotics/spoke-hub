---
layout: single
title: "Spoke CAD Viewer"
permalink: /cad-viewer/
---

This page hosts an interactive 3-D model viewer powered by [OpenCascade.js](https://ocjs.org/).

{% include ocjs_init.html container_id="viewer" %}

<!-- Import map for Three.js -->
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>

<!-- Load Three.js for 3D visualization -->
<script type="module">
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  // Wait for OpenCascade to finish loading then create geometry and display it.
  window.ocjsReady.then(oc => {
    console.log('OpenCascade.js loaded successfully from unpkg CDN');
    console.log('Main callback executed at:', new Date().toISOString());
    
    // Build a torus (major radius 50, minor radius 20)
    // BRepPrimAPI_MakeTorus_2 requires: major_radius, minor_radius, angle (default 2*PI)
    const torusShape = new oc.BRepPrimAPI_MakeTorus_2(50, 20, Math.PI * 2).Shape();

  // Create Three.js scene for visualization
  function createThreeJSViewer() {
    const container = document.getElementById('viewer');
    
    console.log('createThreeJSViewer called');
    
    // Check if a renderer already exists and dispose of it properly
    if (window.threeJSRenderer) {
      console.log('Disposing existing Three.js renderer');
      window.threeJSRenderer.dispose();
      window.threeJSRenderer = null;
    }
    
    // Clear any existing content completely
    container.innerHTML = '';
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(100, 100, 100);
    
    // Renderer setup - let Three.js create its own canvas
    console.log('Creating WebGL renderer...');
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      });
      console.log('WebGL renderer created successfully');
    } catch (error) {
      console.error('Failed to create WebGL renderer:', error);
      throw error;
    }
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Store renderer globally for cleanup
    window.threeJSRenderer = renderer;
    
    // Add renderer canvas to container
    container.appendChild(renderer.domElement);
    
    console.log('Renderer canvas added to container, canvas:', renderer.domElement);
    
    // Controls with improved event handling
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    
    // Suppress WebGL context warnings during mouse events
    const originalWarn = console.warn;
    console.warn = function(message) {
      if (typeof message === 'string' && message.includes('WebGL context')) {
        return; // Suppress WebGL context warnings
      }
      originalWarn.apply(console, arguments);
    };
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create a torus geometry matching OpenCascade parameters
    const geometry = new THREE.TorusGeometry(50, 20, 16, 100);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00aa88,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    const torus = new THREE.Mesh(geometry, material);
    torus.castShadow = true;
    torus.receiveShadow = true;
    scene.add(torus);
    
    // Add wireframe overlay
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ 
      color: 0x000000, 
      opacity: 0.3, 
      transparent: true 
    }));
    scene.add(line);
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      // Rotate both torus and wireframe together
      torus.rotation.x += 0.005;
      torus.rotation.y += 0.005;
      line.rotation.x += 0.005;
      line.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animate();
    
    console.log('Three.js viewer initialized successfully');
    return { scene, camera, renderer, torus };
  }

  // Initialize the Three.js viewer directly (no GLB export)
  try {
    createThreeJSViewer();
    console.log('OpenCascade.js loaded successfully!');
    console.log('Torus shape created:', torusShape);
    console.log('Shape type:', torusShape.ShapeType());
  } catch (error) {
    console.error('Error initializing viewer:', error);
    
    // Fallback to simple message
    const container = document.getElementById('viewer');
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #333; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <h3>OpenCascade.js Loaded Successfully!</h3>
          <p>Torus shape created with:</p>
          <ul style="text-align: left; display: inline-block;">
            <li>Major radius: 50</li>
            <li>Minor radius: 20</li>
            <li>Shape type: ${torusShape.ShapeType()}</li>
          </ul>
          <p><em>3D viewer encountered an error. Check console for details.</em></p>
        </div>
      </div>
    `;
  }
});
</script>

*Rotate with left-drag, pan with right-drag (or two-finger drag), zoom with scroll.*
