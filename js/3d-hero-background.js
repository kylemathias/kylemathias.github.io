(function ($) {
  "use strict";

  // Add this line to expose the init function globally
  window.reinitialize3DBackground = function() {
    init();
    render();
  };

  // Use a progressive loading approach with delayed initialization
  document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if the canvas element exists
    if (document.getElementById('3D-background-three-canvas5')) {
      // Wait for critical content to render before initializing heavy 3D effect
      if ('requestIdleCallback' in window) {
        // Use requestIdleCallback for modern browsers
        requestIdleCallback(function() {
          init();
          render();
        }, { timeout: 2000 }); // 1 second timeout as fallback
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(function() {
          init();
          render();
        }, 400); 
      }
    }
  });  var $window = $(window),
    windowWidth = window.innerWidth,
    windowHeight = window.innerHeight,
    rendererCanvasID = "3D-background-three-canvas5";

  // More efficient page type detection
  function isTemplatePage() {
    const path = window.location.pathname.split('/').pop();
    return path === 'resume.html' || path === 'contact.html' || path === 'about.html' || path.includes('template.html');
  }

  function isHomepage() {
    const path = window.location.pathname.split('/').pop();
    return path === '' || path === 'index.html';
  }

  // Make functions available to the rest of the code
  window.isTemplatePage = isTemplatePage;
  window.isHomepage = isHomepage;

  var camera,
    scene,
    material,
    group,
    lights = [],
    renderer,
    shaderSprite,
    clock = new THREE.Clock();

  var geometry, plane, simplex;

  // Further reduced values for even better performance
  var factor = 250, // Changed from 300 for more interesting wave patterns
    speed = 0.0004, // Slightly increased for smoother movement
    cycle = 0.0001,
    scale = 25, // Increased from 20 for more pronounced waves
    secondaryScale = 10, // Added for multi-layered waves
    secondaryFactor = 600; // Added for multi-layered waves

  // Progressive enhancement: fewer stars on mobile devices
  var starCount = (function() {
    if (window.innerWidth < 768) {
      // Much fewer stars on mobile
      return isTemplatePage() ? 3000 : 2000;
    } else {
      // Default for larger screens
      return isTemplatePage() ? 5000 : 3500;
    }
  })();
  // Track device pixel ratio for zoom detection
  var lastPixelRatio = window.devicePixelRatio;
  
  function init() {
    // Only continue if the canvas element exists
    if (!document.getElementById(rendererCanvasID)) {
      return;
    }    //camera with consistent settings regardless of screen size
    const fov = 60;
    
    camera = new THREE.PerspectiveCamera(
      fov,
      windowWidth / windowHeight,
      1,
      10000
    );
    
    // Use fixed camera position for all screen sizes
    camera.position.set(0, 0, 100);

    //Scene
    scene = new THREE.Scene();

    // Different lighting for template pages vs home page - with reduced intensity for better performance
    if (isTemplatePage()) {
      lights[0] = new THREE.PointLight(0x554488, 0.7, 0); 
      lights[1] = new THREE.PointLight(0x6655aa, 0.7, 0);
      lights[2] = new THREE.PointLight(0x403366, 0.7, 0);
    } else {
      lights[0] = new THREE.PointLight(0x554488, 0.8, 0);
      lights[1] = new THREE.PointLight(0x6655aa, 0.8, 0);
      lights[2] = new THREE.PointLight(0x403366, 0.8, 0);
    }

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);    //WebGL Renderer with optimized parameters
    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById(rendererCanvasID), 
      alpha: true,
      antialias: true,  // Enable antialiasing for smoother lines
      precision: 'mediump', // Medium precision for better performance
      // Use default power preference to ensure Firefox compatibility
      preserveDrawingBuffer: false // Better performance
    });
    renderer.setSize(windowWidth, windowHeight);
    
    // Use the full device pixel ratio for sharp rendering at any zoom level
    // This makes lines much crisper when zooming in
    renderer.setPixelRatio(window.devicePixelRatio);

    // Enhanced starfield that's visible on all pages - with reduced complexity
    var starGeometry = new THREE.Geometry();
    
    for (var i = 0; i < starCount; i++) {
      var star = new THREE.Vector3();
      star.x = THREE.Math.randFloatSpread(4000); 
      star.y = THREE.Math.randFloatSpread(2000);
      
      // Adjust z-depth for template pages
      if (isTemplatePage()) {
        // Bring stars closer on template pages
        star.z = THREE.Math.randFloat(-2000, -500);
      } else {
        star.z = THREE.Math.randFloat(-3000, -1000);
      }
      
      starGeometry.vertices.push(star);
    }

    // Different star appearance for template pages
    var starsMaterial = new THREE.PointsMaterial({
      color: isTemplatePage() ? 0x9999ff : 0x888888,
      size: isTemplatePage() ? 1.2 : 1,
      sizeAttenuation: true,
      transparent: true,
      opacity: isTemplatePage() ? 0.8 : 0.7,
      depthTest: true,
      depthWrite: false, // Better for transparent objects performance
    });
    
    var starField = new THREE.Points(starGeometry, starsMaterial);
    scene.add(starField);    // Only add terrain on the homepage
    if (isHomepage()) {
      group = new THREE.Object3D();
        // Fixed base position values - consistent across all screen sizes
      const baseDistance = -1000;
      const baseYPosition = -300;
      
      // Set fixed positioning regardless of screen size
      group.position.set(0, baseYPosition, baseDistance);
      group.rotation.set(29.8, 0, 0);
      
      // Use consistently high resolution for all screen sizes
      const segmentsX = 220; // High resolution for all devices
      const segmentsY = 120; // High resolution for all devices
      
      console.log(`Grid position: y=${baseYPosition}, z=${baseDistance}, resolution: ${segmentsX}×${segmentsY}`);
      
      geometry = new THREE.PlaneGeometry(4000, 2000, segmentsX, segmentsY);
        material = new THREE.MeshLambertMaterial({
        color: 0x76e4f7, // A pleasing blue color for the grid
        opacity: 1,
        blending: THREE.NormalBlending, // Changed to normal blending for better line quality
        side: THREE.FrontSide,
        transparent: false,
        depthTest: true,
        wireframe: true,
        wireframeLinewidth: 1, // Thinner lines look sharper with antialiasing
      });
      plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);

      simplex = new SimplexNoise();
      moveNoise();

      group.add(plane);
      scene.add(group);
    }

    // Add slow camera movement for template pages
    if (isTemplatePage()) {
      camera.position.z = 150;  // Position camera a bit further back
    }    // Simple resize listener that matches the dist version
    window.addEventListener('resize', onWindowResize, false);
  }
  // Variables for camera movement on template pages
  var cameraMovementAngle = 0;
  var lastFrameTime = 0;
  
  // Use consistent fps for all devices
  var fps = 30;
  var fpsInterval = 1000 / fps;  function render(timestamp) {
    // Skip rendering if canvas doesn't exist
    if (!document.getElementById(rendererCanvasID)) {
      return;
    }
    
    requestAnimationFrame(render);

    // Detect zoom changes by comparing current with last known pixel ratio
    if (window.devicePixelRatio !== lastPixelRatio) {
      lastPixelRatio = window.devicePixelRatio;
      // Update renderer to match the new pixel ratio
      renderer.setPixelRatio(window.devicePixelRatio);
      // Force a full renderer update
      onWindowResize();
    }

    // Throttle to desired fps for better performance
    if (!timestamp) timestamp = 0;
    var elapsed = timestamp - lastFrameTime;
    
    if (elapsed > fpsInterval) {
      lastFrameTime = timestamp - (elapsed % fpsInterval);
      
      // Actual rendering code
      var delta = clock.getDelta();
      
      renderer.setClearColor(0x000000);
  
      if (isHomepage()) {
        // Home page gets the terrain animation
        moveNoise();
      } else if (isTemplatePage()) {
        // Template pages get subtle camera movement
        cameraMovementAngle += delta * 0.1;
        camera.position.x = Math.sin(cameraMovementAngle) * 10;
        camera.position.y = Math.cos(cameraMovementAngle) * 5;
        camera.lookAt(0, 0, -1000);
      }
  
      cycle -= delta * 0.1;
      renderer.render(scene, camera);
    }
  }function onWindowResize() {
    // Get updated window dimensions
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    
    // Update camera aspect ratio
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();
    
    // Reset renderer size and pixel ratio to ensure sharpness at any zoom level
    renderer.setSize(windowWidth, windowHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Force a single render to update the display immediately
    renderer.render(scene, camera);
  }

  function moveNoise() {
    for (let i = 0; i < geometry.vertices.length; i++) {
      let vertex = geometry.vertices[i];
      
      // Primary wave pattern
      let xoff = vertex.x / factor;
      let yoff = vertex.y / factor + cycle;
      let primaryWave = simplex.noise2D(xoff, yoff) * scale;
      
      // Secondary wave pattern (smaller, faster waves)
      let x2 = vertex.x / secondaryFactor;
      let y2 = vertex.y / secondaryFactor + (cycle * 1.5);
      let secondaryWave = simplex.noise2D(x2, y2) * secondaryScale;
      
      // Combine waves for more interesting patterns
      vertex.z = primaryWave + secondaryWave;
    }
    
    geometry.verticesNeedUpdate = true;
    cycle += speed;
  }
})(jQuery);