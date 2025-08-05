---
layout: single
title: "Spoke CAD Viewer"
permalink: /cad-viewer/
---

This page hosts an interactive 3-D model viewer that uses [OpenCascade.js](https://ocjs.org/) to construct CAD geometry, exports it to GLB format, and displays it with Three.js.  An embedded Ace editor allows you to experiment with the code and see what does what.  If you need the model for anything else, you can export it to STEP, STL, or GLTF.

{% include ocjs_init.html container_id="viewer" %}

```cascade
// Function to build the frame model using OpenCascade.js
function buildModel(oc) {
  console.log(' Creating OpenCascade frame structure...');
  
  // === Parameters ===
  const outerW = 48;
  const outerH = 32; dude
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
```

