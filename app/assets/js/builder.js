        var $ = require('jquery');
        // var semantic = require('../../../semantic/out/semantic.js');
        var Transition = require('semantic-ui-transition');

        $.fn.transition = Transition;

        var THREE = require('THREE');
        var TWEEN = require('tween.js');
        var container, renderElementByDomElement, renderElement, stats;
        var camera, scene, acpect, raycaster, renderer, controls;

        var OBJLoader = require('three-obj-loader')(THREE);
        var OrbitControls = require('three-orbit-controls')(THREE);


        // var larguraBuilder = ($('.menu').width() * 100 ) / $('body').width();
        // var larguraPorcentagem = 100 - larguraBuilder + '%';

        // $('#builderContainer').width(larguraPorcentagem);

        var self = this;

        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        var objects = [];
        var particleMaterial;
        var intersected;

        var baseColor = 0xffffff;
        var foundColor = 0x12C0E3;
        var intersectColor = 0x00D66B;


        var radius = 180, theta = 0.005;
        var frustumSize = 1000;
        var amostraOPanda = true;

        // Controls of animation
        var animating = false;
        var timeOutAnimation;
        var pauseAntimation = false;
        var rotating = false;


        //TESTE
        var NEAR = 10;
        var FAR = 3000;
        var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        var FLOOR = -250;
        var mixer, morphs = [];

        initThreeJs();
        createLights();
        animate();

        function initThreeJs() {
            renderElementByDomElement = document.getElementById('builderContainer');

            renderElement = $(renderElementByDomElement);

            scene = new THREE.Scene();
            scene.fog = new THREE.Fog( 0xc6c6c6, 1000, FAR );

            var acpect = renderElement.width() / renderElement.height();

            console.log('LARGURA : ' + renderElement.width(), 'ALTURA: ' + renderElement.height());

            // camera = new THREE.PerspectiveCamera( 60, acpect, 2, 2000 );
            camera = new THREE.PerspectiveCamera( 23, acpect, NEAR, FAR );
            // camera.position.set( -15, 10, 25 );
                // camera.position.z = 150;

                camera.position.x = 600;
                camera.position.y = 275;
                camera.position.z = 1560;

                camera.fov = 50 * Math.PI / 180;
                camera.far = 100;
                camera.near = 0.00001;

                // DEFAULT
                // camera.position.z = 150;

                // camera.lookAt(scene.position);

            raycaster = new THREE.Raycaster();

            // var renderer = new THREE.WebGLRenderer({
            //     antialias: true,
            //     alpha: true,
            //     shadowMapEnabled: true,
            //     shadowMapSoft: true
            // });


            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            renderer.setClearColor( scene.fog.color );

            // renderer.shadowMap.enabled = true;
            // renderer.shadowMap.enabled = true;
            // renderer.shadowMapSoft = true;

            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( renderElement.width(), renderElement.height() );
            renderer.sortObjects = false;
            renderElement.append( renderer.domElement );

            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.renderReverseSided = false;
            renderer.shadowMap.renderSingleSided = false;

            // controls = new OrbitControls( camera, renderElementByDomElement );

            //     controls.lookSpeed = 0.0125;
            //     controls.movementSpeed = 500;
            //     controls.noFly = false;
            //     controls.lookVertical = true;
            //     controls.constrainVertical = true;
            //     controls.verticalMin = 1.5;
            //     controls.verticalMax = 2.0;

            //     controls.lon = 250;
            //     controls.lat = 30;

            // // controls = new OrbitControls( camera, renderElementByDomElement );
            // controls.enableDamping = true;
            // controls.dampingFactor = 0.10;
            // controls.rotateSpeed = 0.25;
            // controls.distanceBounds = [1, 100];
            // controls.distance = 1.5;

            // // // LIMITAÇÃO
            // controls.minPolarAngle = Math.PI / 8 // radians
            // controls.maxPolarAngle = Math.PI / 2; // radians

            // controls.minAzimuthAngle = - Math.PI / 5; // radians
            // controls.maxAzimuthAngle = Math.PI / 5 ; // radians
            // controls.maxPolarAngle = 0.3;

            controls = new OrbitControls( camera, renderElementByDomElement );

            controls.lookSpeed = 0.0125;
            controls.movementSpeed = 500;
            controls.noFly = false;
            controls.lookVertical = true;
            controls.constrainVertical = true;
            controls.verticalMin = 1.5;
            controls.verticalMax = 2.0;

            controls.lon = 250;
            controls.lat = 30;

            // controls = new OrbitControls( camera, renderElementByDomElement );
            controls.enableDamping = true;
            controls.dampingFactor = 0.10;
            controls.rotateSpeed = 0.25;
            controls.distanceBounds = [1, 100];
            controls.distance = 1.5;

            // LIMITAÇÃO
            controls.minPolarAngle = Math.PI / 8 // radians
            controls.maxPolarAngle = Math.PI / 2; // radians


            var manager = new THREE.LoadingManager();
            manager.onProgress = function ( item, loaded, total ) {

                // console.log( item, loaded, total );

            };

            // var texture = new THREE.Texture();

            var onProgress = function ( xhr ) {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    // console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            };

            var onError = function ( xhr ) {
                console.log(xhr);
            };


            // model
            var loader = new THREE.OBJLoader( manager ),
                camiseta;

            // var loader = require('three-obj-loader'),
            //     camiseta;

            //     loader( manager );

            var textureLoader = new THREE.TextureLoader();

            var texturaDahora = textureLoader.load("public/3d-model/textures/grid.jpg");

            // texturaDahora.wrapS = THREE.RepeatWrapping;
            // texturaDahora.wrapT = THREE.RepeatWrapping;

            // texturaDahora.offset.x = -0.05;
            // texturaDahora.offset.y = -0.15;

            // texturaDahora.repeat.x = 2;
            // texturaDahora.repeat.y = 2;
            // texturaDahora.repeat.y = 2;
            // texturaDahora.anisotropy = 16;
            texturaDahora.minFilter = THREE.LinearFilter;

            // texturaDahora.offset.y = 0.5;
            //CHÃO
            var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
            var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

            var ground = new THREE.Mesh( geometry, planeMaterial );

            // ANTIGO CHÃO
            // ground.position.set( 0, FLOOR, 0 );
            ground.position.set( 0, -50, 0 );
            ground.rotation.x = - Math.PI / 2;
            ground.scale.set( 100, 100, 100 );

            ground.castShadow = true;
            ground.receiveShadow = true;

            scene.add( ground );

            loader.load( 'public/3d-model/T-Shirt-Smooth.obj', function ( object ) {

                var material = new THREE.MeshPhongMaterial({
                    map: texturaDahora,
                    side: THREE.DoubleSide,
                    shading: THREE.SmoothShading ,
                    blending: THREE.AdditiveBlending,
                    // vertexColors: true,
                    // alphaTest: 0.5,
                    color: '0xffffff',
                    emissive: "#101010",
                    specular: "#ffffff",
                    shininess: 1,
                    overdraw: true,
                    // wireframe: true,
                    linewidth: 10,
                    depthWrite: true,
                    depthTest: true,
                    combine: THREE.MultiplyOperation,
                    // transparent: true


                    // FUNCIONA
                    /*
                        map: texturaDahora,
                        side: THREE.DoubleSide,
                        // shadding: THREE.SmoothShading,
                        color: '#ffffff',
                        emissive: "#101010",
                        // specular: "#ffffff",
                        shininess: 1,
                        overdraw: true,
                        // wireframe: true,
                        depthWrite: true,
                        depthTest: true,
                        combine: THREE.MultiplyOperation,
                        transparent: true

                    */

                });

                // object.position.x = 30;
                // object.position.y = -50;
                // object.position.z = 1;
                // object.scale.set(5,5,5);

                object.position.x = 30;
                object.position.y = -50;
                object.position.z = 1;
                object.scale.set(5, 5, 5);

                object.name = 'camiseta';



                // object.position.z = 140;

                // baseColor = material.color;

                object.traverse( function ( child ) {

                    if ( child instanceof THREE.Mesh ) {

                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }

                });



                // var lineGeometry = new THREE.Geometry();
                // var vertArray = lineGeometry.vertices;
                // vertArray.push( new THREE.Vector3(-50, -100, 0), new THREE.Vector3(-50, 100, 0) );
                // lineGeometry.computeLineDistances();

                // var lineMaterial = new THREE.LineDashedMaterial( { color: 0x0000cc, dashSize: 3, gapSize: 3 } );
                // var line = new THREE.Line( lineGeometry, lineMaterial );
                // scene.add(line);

                scene.add( object );
                objects.push( object );

            }, onProgress, onError );

            var radius   = 50,
                segments = 64,
                material = new THREE.LineBasicMaterial( { color: 0xCBC9C9 } ),
                geometry = new THREE.CircleGeometry( radius, segments );

            // Remove center vertex
            geometry.vertices.shift();

            var circlePlane = new THREE.Line( geometry, material );

            circlePlane.rotation.x = 300;
            circlePlane.position.y = -50;

            console.log(circlePlane);
            scene.add( circlePlane );

            window.addEventListener('resize', onWindowResize, false);

            $('#builderContainer').on('resize', function(e) {
                alert('diminuiu o builder')
            });

            document.addEventListener('keydown', onKeyDown, false);

            renderElementByDomElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
            // renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
            renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
            window.requestAnimationFrame(render);

            document.addEventListener("DOMContentLoaded", function(event) {
              //do work
              centralizeModel();
            }, false);

            $(document).ready(function(e) {
              centralizeModel();


              $('#comprar').on('click', function(e) {
                  $('#builderContainer').addClass('comprando');
                  $('.controles-build').removeClass('visivel');

                  rotating = true;
              });

              $('.button.color').on('click', function(e) {
                var botao = $(this),
                    corSelecionada = botao.data('hexa').replace('#', '0x'),
                    model = objects[0].children[0];

                model.material.wireframe = false;

                // console.log(corSelecionada);

                model.material.color.setHex( corSelecionada );

                // model.material.color.setHex(model.currentHex);

                // model.currentHex = model.material.color.getHex();
                // //INTERSECTED.material.emissive.setHex(0xff0000);

                // tween = new TWEEN.Tween(model.material.color)
                // .to({r: 0, g: 25, b: 155}, 2000)
                // .easing(TWEEN.Easing.Quartic.In)
                // .start();

              });
            });



            // document.addEventListener( 'mouseup', onDocumentMouseUp, false );
            // renderElementByDomElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
        }

        function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        function createLights() {
            var ambient = new THREE.AmbientLight( 0x8e8c8c );
            ambient.position.set( 0, 200, 0 );
            scene.add( ambient );

            // var lightHelper = new THREE.PointLightHelper( ambient, 20 );
            // scene.add( lightHelper );


            var shadowLight = new THREE.DirectionalLight( 0xdfebff, 0.3 );
            // var shadowLight = new THREE.SpotLight( 0xdfebff, 0.3 );
            shadowLight.position.set( -100, 300, 300 );

            // var pointLightHelper2 = new THREE.PointLightHelper( shadowLight, 20 );
            // scene.add( pointLightHelper2 );

            shadowLight.target.position.set( 0, 0, 0 );
            shadowLight.position.multiplyScalar(1.3);

            shadowLight.castShadow = true;
            //RESOLUÇAO DA SOMBRA
            shadowLight.shadow.mapSize.width = 2048;
            shadowLight.shadow.mapSize.height = 2048;

            // ALTA RESOLUÇÃO
            // shadowLight.shadow.mapSize.width = renderElement.width() * 5;
            // shadowLight.shadow.mapSize.height = renderElement.height() * 5;


            var d = 200;
            // light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
            shadowLight.shadow.bias = - 0.001;

            shadowLight.shadow.camera.left = -d;
            shadowLight.shadow.camera.right = d;
            shadowLight.shadow.camera.top = d;
            shadowLight.shadow.camera.bottom = -d;
            shadowLight.shadow.camera.far = 1000;
            shadowLight.shadow.camera.near = 1;
            // shadowLight.shadowDarkness = 0.2;
            shadowLight.castShadow = true;
            shadowLight.receiveShadow = true;

            scene.add( shadowLight );
            // scene.add( new THREE.DirectionalLightHelper  (shadowLight, 0.001) );
        }
        function onKeyDown() {
            var switchCamera = true;

            if (event.keyCode == 67) { // when 'c' is pressed

                pauseAntimation = false;

                centralizeModel();
                // TRAVAR A CAMERA
                // controls.enabled = !controls.enabled;
            }
        }
        function centralizeModel() {

            if (pauseAntimation) { return; }

            clearTimeout(timeOutAnimation);

            timeOutAnimation = setTimeout(function() {
                var posX = camera.position.x;
                var posY = camera.position.y;
                var posZ = camera.position.z;

                var from = {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z
                };

                // var to = {
                //     x: 0,
                //     y: 5,
                //     z: 25
                // };

                var to = {
                    x: 0,
                    y: 80,
                    z: 500
                };
                var tween = new TWEEN.Tween(from)
                    .to(to, 1500)
                    .easing(TWEEN.Easing.Quintic.InOut)
                    .onUpdate(function () {
                        camera.position.set(this.x, this.y, this.z);
                        camera.lookAt(new THREE.Vector3(0, 0, 0));
                    })
                    .onStart(function () {
                        animating = true;
                    })
                    .onComplete(function () {
                        animating = false;
                        camera.lookAt(new THREE.Vector3(0, 0, 0));

                        if ( !$('#builderContainer').hasClass('comprando') ) {
                            $('.controles-build').addClass('visivel');
                        }
                    })
                    .start();

            }, 500);
        }
        function onWindowResize() {
            var WIDTH = renderElement.width(),
                HEIGHT = renderElement.height();

            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();

            renderer.setSize(WIDTH, HEIGHT);

        }
        function onDocumentMouseMove( event ) {


            event.preventDefault();

            // mouse.x = ( event.clientX / window.width() ) * 2 - 1;
            // mouse.y = - ( event.clientY / renderElement.height() ) * 2 + 1;

            // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            mouse.x = ( event.clientX / renderElement.width() ) * 2 - 1;
            mouse.y = - ( event.clientY / renderElement.height() ) * 2 + 1;

            // console.log(renderElementByDomElement.offsetWidth)

            raycaster.setFromCamera( mouse, camera );

            $("#x").text( mouse.x);
            $("#y").text( mouse.y);
            $("#z").text( camera.position.z);

            // $("#ox").text( objects[0].position.x);
            // $("#oy").text( objects[0].position.y);

            var intersects = raycaster.intersectObjects( objects, true );

            if ( intersects.length > 0 ) {

                if ( intersected != intersects[ 0 ].object ) {
                    // if ( intersected ) intersected.material.color.setHex( baseColor );


                    intersected = intersects[ 0 ].object;
                    // intersected.material.color.setHex( foundColor );

                    // clearTimeout(timerCloseControles);

                    // if (!$('.controles-build').is(':visible')) {
                    //     $('.hide').transition('fade right');
                    // }

                }
                document.body.style.cursor = 'pointer';

                // var particle = new THREE.Sprite( particleMaterial );
                // particle.position.copy( intersects[ 0 ].point );
                // particle.scale.x = particle.scale.y = 16;
                // scene.add( particle );

            } else if ( intersected ) {
                // intersected.material.color.setHex( baseColor );
                intersected = null;
                document.body.style.cursor = 'auto';

                // var timerCloseControles = setTimeout(function () {
                //     if ($('.controles-build').is(':visible')) {
                //         $('.hide').transition('fade right');
                //     }
                // }, 2000);


            }


            // Parse all the faces
            // for ( var i in intersects ) {

            //     intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

            // }

            // renderElementByDomElement.style.cursor = '-webkit-grabbing';
        }
        function onDocumentMouseUp( event ) {
            event.preventDefault();

            pauseAntimation = false;

            centralizeModel();
        }
        function onDocumentMouseDown( event ) {
            event.preventDefault();
            pauseAntimation = true;
            clearTimeout(timeOutAnimation);
        }
        function animate() {

            requestAnimationFrame( animate );

                controls.update();
                // controls.copyInto(camera.position, camera.direction, camera.up)


                TWEEN.update();

                render();
                // update();
        }
        function render() {


            theta += 0.5;

            if (rotating) {
                camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
                // camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
                camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
            }
            camera.lookAt( scene.position );

            camera.updateMatrixWorld();

            renderer.render( scene, camera );
        }
module.exports = function() {
    return ['Barry Allen', 'Hal Jordan', 'Kara Kent', 'Diana Prince', 'Ray Palmer', 'Oliver Queen', 'Bruce Wayne', 'Wally West', 'John Jones', 'Kyle Rayner', 'Arthur Curry', 'Clark Kent'];
}