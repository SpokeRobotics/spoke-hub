// Simplified Mermaid initialization without jQuery
document.addEventListener('DOMContentLoaded', function() {
  console.log('Mermaid init script loaded');
  
  // Check if mermaid is available
  if (typeof mermaid === 'undefined') {
    console.error('Mermaid is not loaded');
    return;
  }
  
  console.log('Mermaid found, initializing...');
  
  // Simple theme - using contrast theme for your site
  var theme = 'default';
  
  // Initialize Mermaid
  mermaid.initialize({ 
    startOnLoad: false, 
    theme: theme,
    securityLevel: 'loose'
  });
  
  // Find all mermaid code blocks
  var mermaidBlocks = document.querySelectorAll('code.language-mermaid');
  console.log('Found', mermaidBlocks.length, 'mermaid code blocks');
  
  // Process each mermaid block
  mermaidBlocks.forEach(function(block, index) {
    console.log('Processing mermaid block', index);
    
    // Create a new div for the mermaid diagram
    var mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.textContent = block.textContent;
    mermaidDiv.id = 'mermaid-' + index;
    
    // Replace the pre/code block with the mermaid div
    block.parentNode.parentNode.replaceChild(mermaidDiv, block.parentNode);
  });
  
  // Render all mermaid diagrams
  if (mermaidBlocks.length > 0) {
    console.log('Rendering mermaid diagrams...');
    mermaid.run();
  }
});
