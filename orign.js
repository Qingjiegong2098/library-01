import *as THREE from "./js/three.module.js";
import { OrbitControls } from './js/OrbitControls.js';
import { GLTFLoader } from './js/GLTFLoader.js';
import { RoomEnvironment } from './js/RoomEnvironment.js';
import Stats from './js/stats.module.js';

let scene, camera, renderer ;
let loadingManager = new THREE.LoadingManager();
let loader = new GLTFLoader(loadingManager).setPath('./model/');

    function init() {
        // 场景，相机
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(-20, 90, 170);

        // 渲染器
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.outputEncoding = THREE.sRGBEncoding;
        document.body.appendChild(renderer.domElement);

        // 创建性能监视器
        let stats = new Stats()
        // 将监视器添加到页面中
        document.body.appendChild(stats.domElement)

        // 材质
        const environment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(environment).texture;

        //灯光

        // 创建平行光源
        const light = new THREE.DirectionalLight(0xffffff, 1); // 平行光，颜色为白色，强度为1
        light.position.set(-40, 40, 20); // 设置灯源位置
        light.castShadow = true; // 允许生成阴影
        //light.target = loader;
        scene.add(light); // 添加到场景中

        //模型加载进程
        loadingManager.onStart = (url,itemsLoaded,itemsTotal)=>{
            //模型开始加载时执行的函数
            console.log(`开始加载模型:${url},当前已加载模型:${itemsLoaded},总模型数:${itemsTotal}`);
        }

        loadingManager.onProgress = (url,itemsLoaded,itemsTotal)=>{
            console.log(`${url}已加载完成,当前已加载模型:${itemsLoaded},总模型数:${itemsTotal}`);
        }

        loadingManager.onError = (url)=>{
            console.log("加载模型时出现错误，错误的模型:"+url)
        }

        // 控制器
        const controls = new OrbitControls( camera, renderer.domElement );
		controls.update();

        function animate() {
            controls.update();
            stats.update()
            requestAnimationFrame(animate);
            renderer.render( scene, camera );
        };

        animate();
    }

    init();
 
 
    function modelloader() {

        //进度条
        const percentDiv = document.getElementById("per");// 获取进度条元素
        percentDiv.style.width = 0.8*400 + "px";//进度条元素长度
        percentDiv.style.textIndent = 0.8*400 + 5 +"px";//缩进元素中的首行文本
        percentDiv.innerHTML =  "80%";//进度百分比

        loader.load('library.glb', function (gltf) {
            gltf.scene.position.set(0,0,2);
            scene.add(gltf.scene);

        // 加载完成，隐藏进度条
        document.getElementById("container").style.display = 'none';
        }, 

        function (xhr) {
        const percent = xhr.loaded / xhr.total;
        percentDiv.style.width = percent * 400 + "px"; //进度条元素长度
        percentDiv.style.textIndent = percent * 400 + 5 + "px"; //缩进元素中的首行文本
        percentDiv.innerHTML = Math.floor(percent * 100) + '%'; //进度百分比
        
        renderer.render(scene, camera);
        });
           
    }

    modelloader();
