function threeInit() {    
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x000000);
    aspectRatio = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshPhongMaterial({color: 0x00ff00, wireframe: true});
    spheres = [];
    
    // make the center sphere
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0,0,0);
    spheres.push(sphere);
    scene.add(sphere);

    // make the surrounding spheres
    // 6 spheres (256/2/20)
    for (var i=0; i<6; i++) {
        var material = new THREE.MeshPhongMaterial({color: 0x00ff00, shading: THREE.FlatShading});
        sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(2*Math.cos(i*Math.PI/3), 2*Math.sin(i*Math.PI/3), 0);
        spheres.push(sphere);
        scene.add(sphere);
    }

    // make random small spheres scattered around
    var geometrySmall = new THREE.SphereGeometry(0.8, 32, 32);
    for (var i=0; i<100; i++) {
        var material = new THREE.MeshPhongMaterial({color: 0x00ff00, shading: THREE.FlatShading});
        sphere = new THREE.Mesh(geometrySmall, material);
        sphere.position.x = Math.random() * 2 - 1;
        sphere.position.y = Math.random() * 2 - 1;
        sphere.position.z = Math.random() * 2 - 1;
        sphere.position.normalize();
        sphere.position.multiplyScalar(10);
        spheres.push(sphere);
        scene.add(sphere);
    }

    var len = spheres.length;
    var light = new THREE.AmbientLight(0x404040, 1);
    var directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 1);
    var directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight2.position.set(-50,-50,-50);
    scene.add(light);
    scene.add(directionalLight1);
    scene.add(directionalLight2);
    camera.position.z = 5;

    function rotateSpheres() {
        for (var i=0; i<len; i++) {
            spheres[i].rotation.x += 0.05;
            spheres[i].rotation.y += 0.05;
        }
    }

    function changeSphereColors() {
        var hex, color;
        var change = function(i) {
            var hex = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
            spheres[i].material.color = new THREE.Color(hex);
            var size = Math.random();
            spheres[i].scale.set(size, size, size);
        }
        for (var i=0; i<len; i++) {
            change(i);
        }
    }

    function cycleSpheres(t) {
        for (var i=1; i<7; i++) {
            spheres[i].position.x =  2*Math.cos(i*Math.PI/3 + t);
            spheres[i].position.y = 2*Math.sin(i*Math.PI/3 + t);
        }
    }

    // when mouseover spheres, light up    
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    function onMouseMove( event ) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // update the picking ray with the camera and mouse position	
        raycaster.setFromCamera( mouse, camera );	

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects( scene.children );

        for ( var i = 0; i < intersects.length; i++ ) {
            intersects[i].object.material.color.set( 0xffffff );        
        }		
    }

    function onMouseClick( event ) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // update the picking ray with the camera and mouse position	
        raycaster.setFromCamera( mouse, camera );	

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects( scene.children );

        for ( var i = 0; i < intersects.length; i++ ) {
            var color = intersects[i].object.material.color;
            intersects[i].object.material.specular.set(color);        
        }
    }

    // attach the camera controls
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', renderCamera);

    var t = 0;
    var render = function() {
        requestAnimationFrame(render);
        rotateSpheres();
        var num = Math.random();
        t += 0.01;
        cycleSpheres(t);

        renderer.render(scene, camera);
    }

    var renderCamera = function() {
        controls.update();
        renderer.render(scene, camera);
    }
    window.addEventListener( 'mousemove', onMouseMove, false );
    // window.addEventListener('mousedown', onMouseClick, false);
    window.requestAnimationFrame(render);
    render();
}

