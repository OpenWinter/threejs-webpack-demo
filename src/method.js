//threejs官网 https://threejs.org
//threejs源码 https://github.com/mrdoob/three.js/tree/r143
//tween https://github.com/tweenjs/tween.js

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  PointLight,
  PointLightHelper,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  CanvasTexture,
  Vector3,
  Vector2,
  Raycaster
} from 'three'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'

import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min'
import TWEEN from '@tweenjs/tween.js'
import {createCanvas} from "./canvas"
import {createController} from './controller'
import loading from './loading'

//场景 + 渲染器 + 摄像机 + 模型 + 灯光
let scene, renderer, camera, controls, gui, container, options
let cube

export function init(_options = {
  el: null,
  modelUrl: null,
  showController: false,
  enablePan: false,
}) {
  //这里可以做一些参数配置
  options = _options
  const { el, showController = true, onModelLoaded } = options
  container = document.querySelector(el);
  container.style.position = "relative";
  if (!container) {
    console.error(`${el} notfound`);
    return;
  }
  createGUI()
  createScene()
  createRenderer()
  // createBox()
  loadModel().then(() => {
    typeof onModelLoaded === 'function' ? onModelLoaded() : null
  })
  if (showController) {
    createController(container)
  }
  createCamera()
  createLight()
  update()
  window.addEventListener("resize", onWindowResize, false);
}

/**
 * 创建可视化控制面板，辅助开发
 */
function createGUI() {
  gui = new GUI()
}

/**
 * 创建场景
 */
function createScene() {
  scene = new Scene()
  //给场景一个背景色，调整下背景色
  scene.background = new Color('#fae9e9')
}

/**
 * 创建渲染器
 */
function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  //开启阴影
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)
}

/**
 * 创建摄像机
 */
function createCamera() {
  camera = new PerspectiveCamera(20, container.clientWidth / container.clientHeight, 1, 30000)
  const start = { x: 0, y: 0, z: 0 }
  new TWEEN.Tween(start)
    .to({ x: 1000, y: 1000, z: 1000 }, 2500)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      const { x, y, z } = start
      camera.position.set(x, y, z)
    })
    .start()
  //给相机加一个轨道控制器，方便我们移动摄像机
  controls = new OrbitControls(camera, renderer.domElement)
  //调整摄像头的控制器，限制摄像机的移动
  controls.autoRotate = false
  controls.autoRotateSpeed = 5
  controls.dampingFactor = 0.05
  controls.enableDamping = true
  controls.enablePan = !!options.enablePan
  controls.enableRotate = true
  controls.minDistance = 400
  controls.maxDistance = 1800
  controls.maxPolarAngle = Math.PI * .5
}

/**
 * 创建一个立方体
 */
function createBox() {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial({ color: 0x00ff00 })
  cube = new Mesh(geometry, material)
  scene.add(cube)
}

/**
 * 加载模型
 */
function loadModel() {
  return new Promise((resolve,reject) => {
    const loader = new GLTFLoader();
    //这个使用来解压缩文件的类
    const dracoLoader = new DRACOLoader()
    //这里是webpack打包，我们将/draco这个目录从库立面复制出来
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader);
    const l = loading("加载中", options.el);
    loader.load(options.modelUrl,
      function (gltf) {
        const model = gltf.scene
        //模型开启阴影
        model.traverse(child => {
          if (child.isMesh) {
            child.frustmCulled = false
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        //缩放
        model.scale.set(0.5, 0.5, 0.5)
        model.position.set(0, -200, 0)
        l.close()
        scene.add(model)
        resolve()
      },
      function (xhr) {
        // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      function (error) {
        console.error('An error happened')
        reject()
      })
  })
}

/**
 * 创建灯光
 */
function createLight() {
  const ambientLight = new AmbientLight('#f0f0f0', .6)
  scene.add(ambientLight)
  const directionalLight = new DirectionalLight('#ffffff', .2)
  scene.add(directionalLight)
  const pointLight = new PointLight('#ffffff', .5, 1800)
  scene.add(pointLight)

  const directionalLightHelper = new DirectionalLightHelper(directionalLight, 20)
  const pointLightHelper = new PointLightHelper(pointLight, 20)

  pointLight.position.set(0, 400, 0)
  directionalLight.position.set(10, 40, 10)

  const folder1 = gui.addFolder('point-light-position')
  folder1.add(pointLight.position, 'x', -600, 600)
  folder1.add(pointLight.position, 'y', -600, 600)
  folder1.add(pointLight.position, 'z', -600, 600)

  const folder2 = gui.addFolder('directional-light-position')
  folder2.add(directionalLight.position, 'x', -600, 600)
  folder2.add(directionalLight.position, 'y', -600, 600)
  folder2.add(directionalLight.position, 'z', -600, 600)

  //阴影是伴随灯光产生的，调整下灯光
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 512 * 2
  directionalLight.shadow.mapSize.height = 512 * 2

  //OrthographicCamera
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 800
  directionalLight.shadow.radius = 2
  const d = 400
  directionalLight.shadow.camera.left = -d
  directionalLight.shadow.camera.right = d
  directionalLight.shadow.camera.top = d
  directionalLight.shadow.camera.bottom = -d

  scene.add(directionalLightHelper)
  scene.add(pointLightHelper)
}

/**
 * 精灵
 */
export function createSprite({ position, content }) {
  const canvas = createCanvas(content)
  const texture = new CanvasTexture(canvas)
  const material = new SpriteMaterial({ map: texture });
  const sprite = new Sprite(material);
  sprite.scale.set(50, 50, 50)
  const { x, y, z } = position
  sprite.position.set(x, y, z)
  scene.add(sprite);
  return { canvas, texture }
}


/**
 * 控制摄像机平移
 * @param type
 */
export function pan(type) {
  const step = 5;
  const element = renderer.domElement;
  const position = camera.position;
  const offset = new Vector3();
  offset.copy(position).sub(controls.target);
  let targetDistance = offset.length();
  switch (type) {
    case "up":
      panUp(2 * step * targetDistance / element.clientHeight, camera.matrix);
      break;
    case "down":
      panUp(-2 * step * targetDistance / element.clientHeight, camera.matrix);
      break;
    case "left":
      panLeft(2 * step * targetDistance / element.clientHeight, camera.matrix);
      break;
    case "right":
      panLeft(-2 * step * targetDistance / element.clientHeight, camera.matrix);
      break;
  }
}

function panLeft(distance, objectMatrix) {
  if (distance === 0) {
    return;
  }
  const val = new Vector3();
  val.setFromMatrixColumn(objectMatrix, 0);
  val.multiplyScalar(-distance);
  const { x, y, z } = controls.target;
  const end = controls.target.clone().add(val);
  const start = { x, y, z };
  new TWEEN.Tween(start).to(end, 500)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      controls.target.copy(start);
    }).start();
}

function panUp(distance, objectMatrix) {
  if (distance === 0) {
    return;
  }
  const val = new Vector3();
  val.setFromMatrixColumn(objectMatrix, 1);
  val.multiplyScalar(distance);
  const { x, y, z } = controls.target;
  const end = controls.target.clone().add(val);
  const start = { x, y, z };
  new TWEEN.Tween(start).to(end, 500)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      controls.target.copy(start);
    }).start();
}

/**
 * 获取点击的模型
 * @param e
 */
export function getClickModels(e) {
  const v = new Vector2();
  const raycaster = new Raycaster();
  v.x = (e.clientX / container.clientWidth) * 2 - 1;
  v.y = -(e.clientY / container.clientHeight) * 2 + 1;
  raycaster.setFromCamera(v, camera);
  return raycaster.intersectObjects(scene.children);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

/**
 * 渲染、更新
 */
function update() {
  requestAnimationFrame(update)
  controls.update()
  renderer.render(scene, camera)
  TWEEN.update()
}
