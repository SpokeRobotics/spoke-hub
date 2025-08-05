---
layout: single
title: "Spoke Frame Viewer"
permalink: /frame-viewer/
---

{% include ocjs_init.html container_id="viewer" %}

```cascade
// Function to build the frame model using OpenCascade.js
function buildModel(oc) {
  console.log(' Creating enhanced OpenCascade frame structure...');
  
  // === Parameters ===
  const outerW = 48;
  const outerH = 32;
  const wall = 4;
  const frameZ = 4;
  const height = 32;
  const beamW = 4;
  const cornerRadius = 8; // Radius for corner circles
  const holeRadius = 2; // Small hole radius
  
  console.log(' Frame parameters:', { outerW, outerH, wall, frameZ, height, beamW, cornerRadius, holeRadius });
  
  try {
    console.log('🔧 Building simple frame side with angled inner corners...');
    
    const components = [];
    
    // === Create one side as a rectangle ===
    console.log('📊 Creating outer rectangle for side...');
    const outerRect = new oc.BRepPrimAPI_MakeBox_3(
      new oc.gp_Pnt_3(0, 0, 0),
      outerW, outerH, frameZ
    ).Shape();
    
    // === Create inner path with diagonal corners using wire ===
    console.log('📊 Creating inner path with 8-segment wire including diagonal corners...');
    
    // Calculate inner dimensions and bevel size
    const innerW = outerW - 2 * wall;
    const innerH = outerH - 2 * wall;
    const bevelSize = 6; // Size of the diagonal corner cuts
    
    // Define the 8 corner points for the wire (starting from bottom-left, going clockwise)
    const x1 = wall;
    const x2 = wall + bevelSize;
    const x3 = outerW - wall - bevelSize;
    const x4 = outerW - wall;
    const y1 = wall;
    const y2 = wall + bevelSize;
    const y3 = outerH - wall - bevelSize;
    const y4 = outerH - wall;
    
    const wirePoints = [
      new oc.gp_Pnt_3(x2, y1, 0),  // 1. Bottom edge start (after bevel)
      new oc.gp_Pnt_3(x3, y1, 0),  // 2. Bottom edge end (before bevel)
      new oc.gp_Pnt_3(x4, y2, 0),  // 3. Bottom-right diagonal
      new oc.gp_Pnt_3(x4, y3, 0),  // 4. Right edge start
      new oc.gp_Pnt_3(x3, y4, 0),  // 5. Top-right diagonal
      new oc.gp_Pnt_3(x2, y4, 0),  // 6. Top edge start
      new oc.gp_Pnt_3(x1, y3, 0),  // 7. Top-left diagonal
      new oc.gp_Pnt_3(x1, y2, 0),  // 8. Left edge start
    ];
    
    // Convert points to vertices first
    const vertices = [];
    wirePoints.forEach((point, index) => {
      try {
        const vertex = new oc.BRepBuilderAPI_MakeVertex(point).Vertex();
        vertices.push(vertex);
        console.log(`✅ Created vertex ${index + 1}`);
      } catch (error) {
        console.log(`⚠️ Failed to create vertex ${index + 1}:`, error.message);
      }
    });
    
    // Create edges between consecutive vertices
    const edges = [];
    for (let i = 0; i < vertices.length; i++) {
      const startVertex = vertices[i];
      const endVertex = vertices[(i + 1) % vertices.length]; // Wrap around to close the wire
      
      try {
        const edge = new oc.BRepBuilderAPI_MakeEdge_2(startVertex, endVertex).Edge();
        edges.push(edge);
        console.log(`✅ Created edge ${i + 1}`);
      } catch (error) {
        console.log(`⚠️ Failed to create edge ${i + 1}:`, error.message);
      }
    }
    
    // Create wire from edges
    let innerWire;
    try {
      const wireBuilder = new oc.BRepBuilderAPI_MakeWire_1();
      edges.forEach((edge, index) => {
        wireBuilder.Add_1(edge);
        console.log(`✅ Added edge ${index + 1} to wire`);
      });
      wireBuilder.Build();
      innerWire = wireBuilder.Wire();
      console.log('✅ Created 8-segment wire with diagonal corners');
    } catch (error) {
      console.log('⚠️ Failed to create wire:', error.message);
      // Fallback to simple rectangle if wire creation fails
      const fallbackRect = new oc.BRepPrimAPI_MakeBox_2(
        new oc.gp_Pnt_3(wall, wall, 0),
        innerW, innerH, frameZ
      ).Shape();
      console.log('⚠️ Using fallback rectangle');
    }
    
    // Create face from wire and extrude to create 3D shape
    let innerShape;
    try {
      // Step 1: Create a TopoDS_Face from the wire
      const wireFaceBuilder = new oc.BRepBuilderAPI_MakeFace_15(innerWire, false);
      const topoDS_Face = wireFaceBuilder.Face();
      console.log('✅ Created TopoDS_Face from wire');
            
      // Create vector for extrusion
      const extrusionVector = new oc.gp_Vec_3(0, 0, frameZ);
      const prism = new oc.BRepPrimAPI_MakePrism_2(topoDS_Face, extrusionVector);
      prism.Build();
      innerShape = prism.Shape();
      console.log('✅ Created 3D inner shape from wire');
    } catch (error) {
      console.log('⚠️ Failed to create 3D shape from wire:', error.message);
      // Fallback to simple rectangle
      innerShape = new oc.BRepPrimAPI_MakeBox_2(
        new oc.gp_Pnt_3(wall, wall, 0),
        innerW, innerH, frameZ
      ).Shape();
      console.log('⚠️ Using fallback rectangle shape');
    }
    
    // Create the final side by subtracting the inner shape from outer rectangle
    try {
      const finalCutOp = new oc.BRepAlgoAPI_Cut_3(outerRect, innerShape);
      finalCutOp.Build();
      const finalSide = finalCutOp.Shape();
      components.push(finalSide);
      console.log('✅ Created side with angled inner corners');
    } catch (error) {
      console.log('⚠️ Final cut operation failed, using solid rectangle:', error.message);
      components.push(outerRect);
    }
    
    // === Combine all components ===
    console.log('🔧 Combining all {} components into compound shape...', components.length);
    
    let frameShape;
    
    try {
      const builder = new oc.BRep_Builder();
      const compound = new oc.TopoDS_Compound();
      builder.MakeCompound(compound);
      
      for (let i = 0; i < components.length; i++) {
        builder.Add(compound, components[i]);
        console.log('📦 Added component {} to compound', i + 1);
      }
      
      frameShape = compound;
      console.log('✅ Successfully created compound shape with {} components', components.length);
    } catch (error) {
      console.log('❌ Failed to create compound shape:', error.message);
      console.log('⚠️ Falling back to first component only');
      frameShape = components[0];
    }
    
    console.log(' Enhanced OpenCascade frame structure created:', frameShape);
    console.log(' Shape type:', frameShape.ShapeType());
    console.log(' Dimensions: {}×{}×{} units', outerW, outerH, height + frameZ);
    
    return frameShape;
    
  } catch (error) {
    console.error(' Error creating OpenCascade frame structure:', error);
    throw error;
  }
}
```
