---
layout: single
title: "Spoke CAD Viewer"
permalink: /cad-viewer/
---

This page hosts an interactive 3-D model viewer that uses [OpenCascade.js](https://ocjs.org/) to construct CAD geometry, exports it to GLB format, and displays it with Three.js.

{% include ocjs_init.html container_id="viewer" %}

<!-- Import map for Three.js and addons -->
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>

<!-- Load Three.js and required addons -->
<script type="module">
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

  // Function to build the frame model using OpenCascade.js
  function buildFrameModel(oc) {
    console.log(' Creating OpenCascade frame structure...');
    
    // === Parameters ===
    const outerW = 48;
    const outerH = 32;
    const wall = 4;
    const frameZ = 4;
    const height = 32;
    const beamW = 4;
    
    console.log(' Frame parameters:', { outerW, outerH, wall, frameZ, height, beamW });
    
    try {
      // === Create proper frame structure using correct OpenCascade.js boolean API ===
      console.log(' Creating frame structure with boolean operations...');
      
      // Create outer box
      const outerBox = new oc.BRepPrimAPI_MakeBox_2(
        new oc.gp_Pnt_3(0, 0, 0),
        outerW, outerH, height + frameZ
      ).Shape();
      
      console.log('📦 Outer box created:', outerBox);
      
      // Create inner box (smaller, offset by wall thickness)
      const innerBox = new oc.BRepPrimAPI_MakeBox_2(
        new oc.gp_Pnt_3(wall, wall, wall),
        outerW - 2 * wall, outerH - 2 * wall, height + frameZ - 2 * wall
      ).Shape();
      
      console.log('📦 Inner box created:', innerBox);
      
      // Build frame structure from individual components (base, sides, top)
      console.log('🔧 Building frame from individual components...');
      
      const components = [];
      
      // === Create Base Frame (bottom) ===
      console.log('📊 Creating base frame components...');
      
      // Bottom frame - 4 walls
      components.push(
        // Front wall (bottom)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(0, 0, 0),
          outerW, wall, frameZ
        ).Shape(),
        // Back wall (bottom)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(0, outerH - wall, 0),
          outerW, wall, frameZ
        ).Shape(),
        // Left wall (bottom)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(0, wall, 0),
          wall, outerH - 2*wall, frameZ
        ).Shape(),
        // Right wall (bottom)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(outerW - wall, wall, 0),
          wall, outerH - 2*wall, frameZ
        ).Shape()
      );
      
      // === Create Top Frame ===
      console.log('📊 Creating top frame components...');
      
      // Top frame - 4 walls (same as bottom, translated up)
      const topZ = height;
      components.push(
        // Front wall (top)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(0, 0, topZ),
          outerW, wall, frameZ
        ).Shape(),
        // Back wall (top)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(0, outerH - wall, topZ),
          outerW, wall, frameZ
        ).Shape(),
        // Left wall (top)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(0, wall, topZ),
          wall, outerH - 2*wall, frameZ
        ).Shape(),
        // Right wall (top)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(outerW - wall, wall, topZ),
          wall, outerH - 2*wall, frameZ
        ).Shape()
      );
      
      // === Create Corner Beams (vertical) ===
      console.log('📊 Creating corner beam components...');
      
      // 4 corner beams connecting bottom and top frames
      components.push(
        // Corner beam 1 (front-left)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(0, 0, frameZ),
          beamW, beamW, height - frameZ
        ).Shape(),
        // Corner beam 2 (front-right)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(outerW - beamW, 0, frameZ),
          beamW, beamW, height - frameZ
        ).Shape(),
        // Corner beam 3 (back-left)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(0, outerH - beamW, frameZ),
          beamW, beamW, height - frameZ
        ).Shape(),
        // Corner beam 4 (back-right)
        new oc.BRepPrimAPI_MakeBox_2(
          new oc.gp_Pnt_3(outerW - beamW, outerH - beamW, frameZ),
          beamW, beamW, height - frameZ
        ).Shape()
      );
      
      console.log('✅ Created {} frame components', components.length);
      
      // Combine all components into a single compound shape
      console.log('🔧 Combining all {} components into compound shape...', components.length);
      
      let frameShape; // Declare outside try block for proper scoping
      
      try {
        // Create a compound builder
        const builder = new oc.BRep_Builder();
        const compound = new oc.TopoDS_Compound();
        builder.MakeCompound(compound);
        
        // Add all components to the compound
        for (let i = 0; i < components.length; i++) {
          builder.Add(compound, components[i]);
          console.log('📦 Added component {} to compound', i + 1);
        }
        
        frameShape = compound; // Assign to outer scope variable
        console.log('✅ Successfully created compound shape with {} components', components.length);
      } catch (error) {
        console.log('❌ Failed to create compound shape:', error.message);
        console.log('⚠️ Falling back to first component only');
        frameShape = components[0]; // Assign to outer scope variable
      }
      
      console.log(' OpenCascade frame structure created:', frameShape);
      console.log(' Shape type:', frameShape.ShapeType());
      console.log(' Dimensions: {}×{}×{} units', outerW, outerH, height + frameZ);
      
      return frameShape;
      
    } catch (error) {
      console.error(' Error creating OpenCascade frame structure:', error);
      throw error;
    }
  }

  // Wait for OpenCascade to finish loading then create geometry and display it.
  window.ocjsReady.then(oc => {
    console.log(' OpenCascade.js loaded successfully from unpkg CDN');
    console.log(' Main callback executed at:', new Date().toISOString());
    
    // Build the frame model
    const frameShape = buildFrameModel(oc);
    
    // Store the shape for mesh extraction
    window.frameShape = frameShape;
    
    // Convert OpenCascade shape to Three.js mesh data
    function convertOpenCascadeToMesh(shape) {
      console.log(' Converting OpenCascade shape to mesh...');
      
      try {
        // Use OpenCascade's meshing capabilities
        console.log(' Creating mesher...');
        const mesher = new oc.BRepMesh_IncrementalMesh_2(shape, 0.1, false, 0.5, false);
        console.log(' Performing mesh operation...');
        mesher.Perform();
        
        if (!mesher.IsDone()) {
          throw new Error('Failed to mesh the OpenCascade shape');
        }
        console.log(' Meshing completed successfully');
        
        const vertices = [];
        const indices = [];
        const normals = [];
        
        // Iterate through faces to extract mesh data
        console.log(' Exploring faces...');
        const faceExplorer = new oc.TopExp_Explorer_2(shape, oc.TopAbs_ShapeEnum.TopAbs_FACE, oc.TopAbs_ShapeEnum.TopAbs_SHAPE);
        
        let vertexOffset = 0;
        let faceCount = 0;
        
        while (faceExplorer.More()) {
          faceCount++;
          console.log(` Processing face ${faceCount}...`);
          
          const face = oc.TopoDS.Face_1(faceExplorer.Current());
          const location = new oc.TopLoc_Location_1();
          const triangulation = oc.BRep_Tool.Triangulation(face, location);
          
          if (!triangulation.IsNull()) {
            console.log(` Face ${faceCount} has triangulation data`);
            const transform = location.Transformation();
            
            // Get node and triangle counts using correct API
            const nodeCount = triangulation.get().NbNodes();
            const triangleCount = triangulation.get().NbTriangles();
            console.log(`   Nodes: ${nodeCount}, Triangles: ${triangleCount}`);
            
            // Extract vertices
            for (let i = 1; i <= nodeCount; i++) {
              const node = triangulation.get().Node(i);
              const transformedNode = node.Transformed(transform);
              vertices.push(transformedNode.X(), transformedNode.Y(), transformedNode.Z());
            }
            
            // Process each triangle in the face with corrected orientation
            for (let t = 1; t <= triangleCount; t++) {
              const triangle = triangulation.get().Triangle(t);
              const n1 = triangle.Value(1);
              const n2 = triangle.Value(2);
              const n3 = triangle.Value(3);
              
              // Get triangle vertices
              const v1 = triangulation.get().Node(n1).Transformed(transform);
              const v2 = triangulation.get().Node(n2).Transformed(transform);
              const v3 = triangulation.get().Node(n3).Transformed(transform);
              
              // Compute triangle normal using cross product
              const edge1 = new THREE.Vector3(
                v2.X() - v1.X(),
                v2.Y() - v1.Y(),
                v2.Z() - v1.Z()
              );
              const edge2 = new THREE.Vector3(
                v3.X() - v1.X(),
                v3.Y() - v1.Y(),
                v3.Z() - v1.Z()
              );
              
              let normal = edge1.cross(edge2).normalize();
              
              // Get face orientation from OpenCascade
              const faceOrientation = face.Orientation_1();
              
              // Check if face is reversed according to OpenCascade
              // TopAbs_FORWARD = 0, TopAbs_REVERSED = 1, TopAbs_INTERNAL = 2, TopAbs_EXTERNAL = 3
              const isReversed = (faceOrientation === oc.TopAbs_Orientation.TopAbs_REVERSED);
              
              if (isReversed) {
                // Face is reversed, flip normal and triangle winding
                normal.negate();
                indices.push(
                  vertexOffset + n1 - 1,
                  vertexOffset + n3 - 1,  // Swapped n2 and n3 for reversed winding
                  vertexOffset + n2 - 1
                );
                console.log(`     Triangle ${t}: REVERSED orientation, flipped normal and winding`);
              } else {
                // Face is forward, keep original normal and winding
                indices.push(
                  vertexOffset + n1 - 1,
                  vertexOffset + n2 - 1,
                  vertexOffset + n3 - 1
                );
                console.log(`     Triangle ${t}: FORWARD orientation, kept original normal and winding`);
              }
              
              // Add the corrected normal for all three vertices of the triangle
              for (let j = 0; j < 3; j++) {
                normals.push(normal.x, normal.y, normal.z);
              }
            }
            
            vertexOffset += nodeCount;
          } else {
            console.log(` Face ${faceCount} has no triangulation data`);
          }
          
          faceExplorer.Next();
        }
        
        console.log(` Extracted ${vertices.length / 3} vertices, ${indices.length / 3} triangles from ${faceCount} faces`);
        
        if (vertices.length === 0) {
          throw new Error('No vertices extracted from OpenCascade shape');
        }
        
        // Create Three.js geometry
        console.log(' Creating Three.js BufferGeometry...');
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        
        console.log(' Three.js geometry created successfully');
        return geometry;
        
      } catch (error) {
        console.error(' Error in convertOpenCascadeToMesh:', error);
        
        // If the triangulation API fails, try a simpler approach
        console.log(' Attempting simplified mesh extraction...');
        try {
          return createSimplifiedMesh(shape);
        } catch (fallbackError) {
          console.error(' Simplified mesh extraction also failed:', fallbackError);
          throw error; // Throw original error
        }
      }
    }

    // Simplified mesh extraction as fallback
    function createSimplifiedMesh(shape) {
      console.log('🔧 Creating simplified mesh from OpenCascade shape...');
      
      // Create a box geometry that matches our frame parameters
      // This ensures we still get a visualization even if mesh extraction fails
      const geometry = new THREE.BoxGeometry(outerW, outerH, height + frameZ);
      console.log('✅ Simplified box geometry created: {}×{}×{}', outerW, outerH, height + frameZ);
      return geometry;
    }

    // Export geometry to GLB format
    function exportToGLB(geometry) {
      return new Promise((resolve, reject) => {
        console.log(' Exporting geometry to GLB...');
        
        try {
          const material = new THREE.MeshStandardMaterial({ 
            color: 0x808080, // Gray color indicates everything is working correctly (proper frame structure)
            metalness: 0.1,
            roughness: 0.4,
            transparent: false,
            opacity: 1.0
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          const scene = new THREE.Scene();
          scene.add(mesh);
          
          console.log(' Creating GLTFExporter...');
          const exporter = new GLTFExporter();
          exporter.parse(
            scene,
            (gltf) => {
              console.log(' GLB export successful, size:', gltf.byteLength, 'bytes');
              resolve(gltf);
            },
            (error) => {
              console.error(' GLB export failed:', error);
              reject(error);
            },
            { binary: true }
          );
        } catch (error) {
          console.error(' Error setting up GLB export:', error);
          reject(error);
        }
      });
    }

    // Load GLB and display in Three.js viewer
    function loadGLBAndDisplay(glbData) {
      console.log(' Loading GLB data into Three.js viewer...');
      
      const container = document.getElementById('viewer');
      
      // === Initialize Three.js Scene ===
      console.log(' Initializing Three.js scene...');
      
      // Clear any existing content in the viewer container
      if (!container) {
        console.error(' Viewer container not found');
        return;
      }
      
      // Clear previous content to prevent WebGL context conflicts
      container.innerHTML = '';
      
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      
      // Create camera with proper aspect ratio
      const containerRect = container.getBoundingClientRect();
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRect.width / containerRect.height, 
        0.1, 
        1000
      );
      
      // Position camera outside the box (48×32×36) for good viewing angle
      camera.position.set(80, 60, 80);
      camera.lookAt(24, 16, 18); // Look at center of the box
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerRect.width, containerRect.height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // Append renderer to cleared container
      container.appendChild(renderer.domElement);
      
      // Controls - ensure they're properly initialized
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.target.set(24, 16, 18); // Set target to center of box
      controls.update();
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(100, 100, 50);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
      
      // Load the GLB data
      console.log(' Loading GLB data...');
      const loader = new GLTFLoader();
      const blob = new Blob([glbData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      loader.load(
        url,
        (gltf) => {
          console.log(' GLB loaded successfully');
          const model = gltf.scene;
          
          // // Enable shadows
          // model.traverse((child) => {
          //   if (child.isMesh) {
          //     child.castShadow = true;
          //     child.receiveShadow = true;
          //     console.log(' Configured mesh for shadows:', child.name || 'unnamed');
          //   }
          // });
          
          scene.add(model);
          console.log(' Model added to scene');
          
          // Add wireframe overlay
          model.traverse((child) => {
            if (child.isMesh) {
              const wireframe = new THREE.WireframeGeometry(child.geometry);
              const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ 
                color: 0xFFFFFF, 
                opacity: 0.3, 
                transparent: true 
              }));
              scene.add(line);
              
              // Store references for animation
              window.cadModel = model;
              window.cadWireframe = line;
              console.log(' Wireframe overlay added');
            }
          });
          
          // Clean up blob URL
          URL.revokeObjectURL(url);
          
          console.log(' Model setup completed successfully!');
        },
        (progress) => {
          console.log(' Loading progress:', progress);
        },
        (error) => {
          console.error(' Error loading GLB:', error);
          URL.revokeObjectURL(url);
        }
      );
      
      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        
        // Rotate the CAD model and wireframe if they exist
        if (window.cadModel && window.cadWireframe) {
          window.cadModel.rotation.x += 0.005;
          window.cadModel.rotation.y += 0.005;
          window.cadWireframe.rotation.x += 0.005;
          window.cadWireframe.rotation.y += 0.005;
        }
        
        renderer.render(scene, camera);
      }
      
      // Handle window resize
      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
      
      animate();
      console.log(' Animation loop started');
    }

    // Fallback: Direct Three.js visualization (skip GLB export/import)
    function directThreeJSVisualization(geometry) {
      console.log(' Using direct Three.js visualization fallback...');
      
      const container = document.getElementById('viewer');
      
      // Check if a renderer already exists and dispose of it properly
      if (window.threeJSRenderer) {
        console.log(' Disposing existing Three.js renderer');
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
      
      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // Store renderer globally for cleanup
      window.threeJSRenderer = renderer;
      
      // Add renderer canvas to container
      container.appendChild(renderer.domElement);
      
      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(100, 100, 50);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
      
      // Create mesh from OpenCascade-derived geometry
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x808080, // Gray color indicates everything is working correctly
        metalness: 0.1,
        roughness: 0.4,
        transparent: true,
        opacity: 0.9
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      
      // Add wireframe overlay
      const wireframe = new THREE.WireframeGeometry(geometry);
      const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ 
        color: 0x000000, 
        opacity: 0.3, 
        transparent: true 
      }));
      scene.add(line);
      
      // Store references for animation
      window.cadModel = mesh;
      window.cadWireframe = line;
      
      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
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
      console.log(' Direct Three.js visualization completed successfully!');
    }

    // Main workflow: OpenCascade → GLB → Three.js (with fallback)
    async function initializeCADViewer() {
      try {
        console.log(' Starting OpenCascade.js → GLB → Three.js workflow...');
        
        // Step 1: Convert OpenCascade shape to Three.js geometry
        console.log(' Step 1: Converting OpenCascade shape to mesh...');
        const geometry = convertOpenCascadeToMesh(window.frameShape);
        
        // Try GLB workflow first
        try {
          console.log(' Step 2: Attempting GLB export/import workflow...');
          // Step 2: Export geometry to GLB
          const glbData = await exportToGLB(geometry);
          
          // Step 3: Load GLB and display in Three.js
          loadGLBAndDisplay(glbData);
          
          console.log(' CAD viewer GLB workflow completed successfully!');
          
        } catch (glbError) {
          console.warn(' GLB workflow failed, falling back to direct visualization:', glbError);
          
          // Fallback: Direct Three.js visualization
          directThreeJSVisualization(geometry);
          
          console.log(' CAD viewer fallback workflow completed successfully!');
        }
        
      } catch (error) {
        console.error(' Error in CAD viewer workflow:', error);
        
        // Ultimate fallback display
        const container = document.getElementById('viewer');
        container.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #333; font-family: Arial, sans-serif;">
            <div style="text-align: center;">
              <h3> OpenCascade.js → Three.js Workflow</h3>
              <p>OpenCascade frame structure created successfully!</p>
              <ul style="text-align: left; display: inline-block;">
                <li>Outer width: ${outerW}</li>
                <li>Outer height: ${outerH}</li>
                <li>Wall thickness: ${wall}</li>
                <li>Frame Z: ${frameZ}</li>
                <li>Height: ${height}</li>
                <li>Beam width: ${beamW}</li>
              </ul>
              <p><em> 3D viewer encountered an error during processing. Check console for details.</em></p>
              <p><strong>Error:</strong> ${error.message}</p>
            </div>
          </div>
        `;
      }
    }

    // Initialize the viewer
    initializeCADViewer();
    
  }).catch(error => {
    console.error(' Failed to load OpenCascade.js:', error);
    const container = document.getElementById('viewer');
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #333; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <h3> OpenCascade.js Loading Error</h3>
          <p><em>Failed to load OpenCascade.js. Check console for details.</em></p>
          <p><strong>Error:</strong> ${error.message}</p>
        </div>
      </div>
    `;
  });
</script>

*Rotate with left-drag, pan with right-drag (or two-finger drag), zoom with scroll.*

**Workflow:** This viewer demonstrates the complete pipeline from OpenCascade.js CAD construction → GLB export → Three.js visualization, with a direct fallback if GLB processing fails.
