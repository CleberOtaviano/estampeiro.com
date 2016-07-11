        var THREE = require('THREE');
        var container, renderElementByDomElement, renderElement, stats;
        var camera, scene, acpect, raycaster, renderer, controls;

        var OBJLoader = require('three-obj-loader')(THREE);
        var OrbitControls = require('three-orbit-controls')(THREE);

        var self = this;

        var mouse = new THREE.Vector2(), INTERSECTED;
        var radius = 180, theta = 0.005;
        var frustumSize = 1000;

        initThreeJs();
        animate();

        function initThreeJs() {
            renderElementByDomElement = document.getElementById('builderContainer');

            renderElement = $(renderElementByDomElement);

            scene = new THREE.Scene();
            var acpect = renderElement.width() / renderElement.height();

            camera = new THREE.PerspectiveCamera( 60, acpect, 2, 2000 );
                // camera.position.z = 150;

                camera.position.x = -15;
                camera.position.y = 10;
                camera.position.z = 25;

                camera.fov = 50 * Math.PI / 180;
                camera.far = 100;
                camera.near = 0.00001;

                // DEFAULT
                // camera.position.z = 150;

                camera.lookAt(scene.position);

            raycaster = new THREE.Raycaster();

            // var renderer = new THREE.WebGLRenderer({
            //     antialias: true,
            //     alpha: true,
            //     shadowMapEnabled: true,
            //     shadowMapSoft: true
            // });


            renderer = new THREE.WebGLRenderer({ alpha: true });
            // renderer.setClearColor( 0xffff00, 0 );
            // renderer.alpha = true;
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( renderElementByDomElement.offsetWidth, renderElementByDomElement.offsetHeight );
            renderer.sortObjects = false;
            renderElement.append( renderer.domElement );


            // controls = require('orbit-controls')({
            //     position: camera.position,
            //     distance: 0,
            //     position: [ 0, 0, 0 ]
            // });

            controls = new OrbitControls( camera, renderElementByDomElement );
            controls.enableDamping = true;
            controls.dampingFactor = 0.10;
            // controls.enableZoom = false;
            // controls = require('orbit-controls')( camera, renderElementByDomElement );
            // controls.addEventListener( 'change', render, false );
            // controls.noZoom = true;
            // controls.noKeys = true;
            // controls.noPan = true;
            controls.rotateSpeed = 0.25;

            controls.distanceBounds = [1, 100];
            controls.distance = 1.5;

            // LIMITAÇÃO
            controls.minPolarAngle = Math.PI / 8 // radians
            controls.maxPolarAngle = Math.PI / 2; // radians

            controls.minAzimuthAngle = - Math.PI / 5; // radians
            controls.maxAzimuthAngle = Math.PI / 5 ; // radians
                // controls.maxPolarAngle = 0.3;

            var manager = new THREE.LoadingManager();
            manager.onProgress = function ( item, loaded, total ) {

                console.log( item, loaded, total );

            };

            // var texture = new THREE.Texture();

            var onProgress = function ( xhr ) {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            };

            var onError = function ( xhr ) {
                console.log(xhr);
            };

            var helper = new THREE.GridHelper( 200, 10, 0x2a2a37, 0x2a2a37 );
                helper.position.y = -10;
                scene.add( helper );

            var sphere = new THREE.SphereGeometry();
            var object = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( {color: 0xeeeeee } ) );
            var box = new THREE.BoxHelper( object );
            scene.add( box );


            var pointLight = new THREE.PointLight( 0xffffff, 0.7, 100 );
            pointLight.position.set( 10, 10, 10 );
            scene.add( pointLight );

            // var sphereSize = 1;
            // var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
            // scene.add( pointLightHelper );

            // model
            var loader = new THREE.OBJLoader( manager ),
                camiseta;

            // var loader = require('three-obj-loader'),
            //     camiseta;

            //     loader( manager );

            var textureLoader = new THREE.TextureLoader();

            var texturaDahora = textureLoader.load("public/3d-model/textures/textura-moca.jpg");

            // texturaDahora.wrapS = THREE.RepeatWrapping;
            // texturaDahora.wrapT = THREE.RepeatWrapping;

            texturaDahora.offset.x = -0.05;
            texturaDahora.offset.y = -0.15;

            texturaDahora.repeat.x = 2;
            texturaDahora.repeat.y = 2;

            texturaDahora.minFilter = THREE.LinearFilter;

            console.log(texturaDahora)
            // texturaDahora.offset.y = 0.5;

            loader.load( 'public/3d-model/tshirt-male.obj', function ( object ) {

                var material = new THREE.MeshPhongMaterial({
                    map: texturaDahora,
                    side: THREE.DoubleSide,
                    shadding: THREE.SmoothShading,
                    color: '#ffffff',
                    emissive: "#101010",
                    ambient: 0xff0000,
                    // specular: "#ffffff",
                    shininess: 1,
                    overdraw: true,
                    // wireframe: true,
                    depthWrite: true,
                    depthTest: true,
                    combine: THREE.MultiplyOperation,
                    transparent: true
                });

                object.position.x = 6;
                object.position.y = -10;
                object.position.z = 6;
                // object.position.z = 140;

                object.traverse( function ( child ) {

                    if ( child instanceof THREE.Mesh ) {

                        child.material = material;
                    }

                });

                scene.add( object );

            }, onProgress, onError );


            var geometry = new THREE.SphereGeometry( 1, 1, 1);

            for ( var i = 0; i < 300; i ++ ) {

                var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );

                object.position.x = Math.random() * 800 - 400;
                object.position.y = Math.random() * 800 - 400;
                object.position.z = Math.random() * 800 - 400;

                object.rotation.x = Math.random() * 2 * Math.PI;
                object.rotation.y = Math.random() * 2 * Math.PI;
                object.rotation.z = Math.random() * 2 * Math.PI;

                // object.scale.x = Math.random() + 0.5;
                // object.scale.y = Math.random() + 0.5;
                // object.scale.z = Math.random() + 0.5;

                // scene.add( object );

            }


            var light = new THREE.PointLight( 0xffffff, 0.4 );
            light.position.set( -10, 11, 15 );
            scene.add( light );

            // var sphereSize2 = 2;
            // var pointLightHelper2 = new THREE.PointLightHelper( light, sphereSize2 );
            // scene.add( pointLightHelper2 );

            var directionalLight = new THREE.DirectionalLight( 0x7F7F7F, 0.4);
            directionalLight.position.set( 1, 1, -100 );
            scene.add( directionalLight );

            var ambientLight = new THREE.AmbientLight( 0x595959, 0.1 );
            scene.add( ambientLight );

            window.addEventListener('resize', onWindowResize, false);
            document.addEventListener('keydown', onKeyDown, false);

            // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            // document.addEventListener( 'mouseup', onDocumentMouseUp, false );
            // renderElementByDomElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
        }

        function onKeyDown() {
            var switchCamera = true;

            if (event.keyCode == 67) { // when 'c' is pressed

                console.log(camera)

                // TRAVAR A CAMERA
                // controls.enabled = !controls.enabled;
            }
        }
        function onWindowResize() {
            var WIDTH = renderElement.width(),
                HEIGHT = renderElement.height();

            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        }

        function onDocumentMouseMove( event ) {

            event.preventDefault();

            console.log('MANOW');
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            // renderElementByDomElement.style.cursor = '-webkit-grabbing';

            raycaster.setFromCamera( mouse, camera );

            var intersects = raycaster.intersectObjects( scene.children );

            if ( intersects.length > 0 ) {
                // console.log(intersects[0].object);

                if ( INTERSECTED != intersects[ 0 ].object ) {

                    if (intersects[0].object.name === 'uploaderFoto') {

                        renderElementByDomElement.style.cursor = '-webkit-pointer';
                    } else {

                    }
                    // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                    // INTERSECTED = intersects[ 0 ].object;
                    // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    // INTERSECTED.material.emissive.setHex( 0xff0000 );


                }

            } else {

                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

            }

        }

        function onDocumentMouseUp( event ) {

            event.preventDefault();

            raycaster.setFromCamera( mouse, camera );

            var intersects = raycaster.intersectObjects( scene.children );

            if ( intersects.length > 0 ) {
                // console.log(intersects[0].object);

                if ( INTERSECTED != intersects[ 0 ].object ) {

                    // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                    // INTERSECTED = intersects[ 0 ].object;
                    // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    // INTERSECTED.material.emissive.setHex( 0xff0000 );


                }

            } else {

                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

            }

        }

        function animate() {

            requestAnimationFrame( animate );

                controls.update();
                // controls.copyInto(camera.position, camera.direction, camera.up)


                // TWEEN.update();

                render();
                // update();
        }

        function render() {

            theta += 0.1;

            // camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
            // camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
            // camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
            camera.lookAt( scene.position );

            camera.updateMatrixWorld();

            // find intersections
            raycaster.setFromCamera( mouse, camera );

            var intersects = raycaster.intersectObjects( scene.children );

            if ( intersects.length > 0 ) {

                    // console.log(intersects);

                if ( INTERSECTED != intersects[ 0 ].object ) {

                    // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                    // INTERSECTED = intersects[ 0 ].object;
                    // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    // INTERSECTED.material.emissive.setHex( 0xff0000 );

                }

            } else {

                // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

            }

            renderer.render( scene, camera );
        }