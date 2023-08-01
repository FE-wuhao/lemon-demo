/*
 * @Author: nhsoft.wh
 * @Date: 2023-08-01 08:52:20
 * @LastEditors: nhsoft.wh
 * @LastEditTime: 2023-08-01 10:30:30
 * @Description: file content
 */
import electricalMachineryModel from "@/assets/electricalMachinery.gltf";
import { useMount } from "ahooks";
import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  GLTF,
  GLTFLoader,
} from "three/examples/jsm/loaders/GLTFLoader";

import styles from "./index.less";

export interface IThreeDimensionalRenderConditions {
  appenddedNode: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export interface IThreeDimensionalRenderProps
  extends Omit<IThreeDimensionalRenderConditions, "appenddedNode"> {
  /** 轨道控制器 */
  orbitController: OrbitControls;
  /** 导入的模型 */
  model: THREE.Group;
}

/**
 * 创建场景
 * @returns {THREE.Scene}
 */
export const createScene = (): THREE.Scene => {
  // 创建场景
  const scene = new THREE.Scene();

  return scene;
};

/**
 * 为场景添加光源
 * @param scene 场景对象
 */
export const addLight = (scene: THREE.Scene) => {
  // 创建环境光
  const envLight = new THREE.AmbientLight("#ffffff", 0.4);
  // 设置环境光位置
  envLight.position.set(50, 50, 50);
  // 环境光加入场景
  scene.add(envLight);
  // 创建点光源
  const spotLight = new THREE.SpotLight("#ffffff", 10);
  // 设置点光源位置
  spotLight.position.set(2, 2, 2);
  // 设置点光源可见
  spotLight.visible = true;
  // 点光源加入场景
  scene.add(spotLight);
  // 创建点光源
  const spotLight1 = new THREE.SpotLight("#ffffff", 10);
  // 设置点光源位置
  spotLight1.position.set(-2, -2, -2);
  // 设置点光源可见
  spotLight1.visible = true;
  // 点光源加入场景
  scene.add(spotLight1);
};

/**
 * 创建相机
 * @returns {THREE.PerspectiveCamera}
 */
export const createCamera = (
  aspectRatio: number = window.innerWidth / window.innerHeight
): THREE.PerspectiveCamera => {
  // 创建透视相机
  const camera = new THREE.PerspectiveCamera(
    75, // 角度
    aspectRatio, // 宽高比
    0.1, // 始截面
    1000 // 终截面
  );
  // 设置相机位置
  camera.position.z = 5;

  return camera;
};

/**
 * 创建渲染器
 * @param appenddedNode 被挂载的节点
 * @param canvasWidth 画布宽度
 * @param canvasHeight 画布高度
 * @returns {THREE.WebGLRenderer}
 */
export const createRenderer = (
  appenddedNode: HTMLElement = document.body,
  canvasWidth: number = appenddedNode.clientWidth,
  canvasHeight: number = appenddedNode.clientHeight
): THREE.WebGLRenderer => {
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer();
  // 设置画布的宽高为屏幕宽高
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置画布背景色
  renderer.setClearColor("#FFF", 0);
  // 将画布挂载到指定元素上（不传默认body）
  appenddedNode.appendChild(renderer.domElement);

  return renderer;
};

/**
 * 初始化3d渲染
 * @returns {IThreeDimensionalRenderConditions}
 */
export const initThreeDimensional =
  (): IThreeDimensionalRenderConditions => {
    const appenddedNode = document.getElementById(
      "three-dimensional-model-container"
    ) as HTMLElement;

    // 创建场景
    const scene = createScene();
    // 为场景添加光源
    addLight(scene);
    // 创建相机
    const camera = createCamera(
      window.innerWidth / window.innerHeight
    );
    // 将相机加入场景
    scene.add(camera);

    // 创建渲染器
    const renderer = createRenderer(appenddedNode as HTMLElement);

    return { appenddedNode, scene, camera, renderer };
  };

/**
 * 加载gltf格式的模型
 * @param model 模型文件
 * @returns {Promise<THREE.Group>}
 */
export const loadGLTFModel = (
  model: any,
  scene: THREE.Scene
): Promise<THREE.Group> => {
  const loader = new GLTFLoader();

  return new Promise<THREE.Group>((resolve) => {
    loader.load(model, (successResponse: GLTF) => {
      const modelInstance = successResponse.scene;

      // 设置模型位置
      modelInstance.position.set(1, -1, -4);
      // 设置模型缩放大小
      modelInstance.scale.set(0.004, 0.004, 0.004);
      // 将模型加入场景
      scene.add(modelInstance);

      resolve(modelInstance);
    });
  });
};

/**
 * 创建轨道控制器
 * @param camera 相机实例
 * @param element 画布渲染元素
 * @returns {OrbitControls}
 */
const createOrbitController = (
  camera: THREE.PerspectiveCamera,
  element: HTMLElement
): OrbitControls => {
  // 创建轨道控制器
  const controller = new OrbitControls(camera, element);
  // 为轨道控制器添加阻尼系数
  controller.enableDamping = true;
  // 控制画布自动旋转
  controller.autoRotate = true;
  // 控制自动旋转的速度
  controller.autoRotateSpeed = 5;

  return controller;
};

/**
 * 添加坐标系
 * @param scene 场景
 * @param size 坐标系的大小
 */
export const addAxes = (scene: THREE.Scene, size: number = 5) => {
  // 创建坐标系，大小为5
  const axes = new THREE.AxesHelper(size);
  // 坐标系添加到场景
  scene.add(axes);
};

/**
 * 3D渲染函数
 * @param props
 */
export const threeDimensionalRender = (
  props: IThreeDimensionalRenderProps
) => {
  const { scene, camera, renderer, orbitController, model } = props;
  // 更新轨道控制器
  orbitController.update();
  // 当前帧渲染
  renderer.render(scene, camera);
  // 递归下一帧渲染
  requestAnimationFrame(() => {
    threeDimensionalRender({
      scene,
      camera,
      renderer,
      orbitController,
      model,
    });
  });
};

const ThreeDimensionalModel: React.FC = () => {
  // 初始挂载时启动渲染器
  useMount(async () => {
    // 获取初始化的必要条件
    const { scene, camera, renderer } = initThreeDimensional();
    // 创建轨道控制器
    const orbitController = createOrbitController(
      camera,
      renderer.domElement
    );
    // 添加坐标系
    addAxes(scene);
    // 加载3D模型
    const model = await loadGLTFModel(
      electricalMachineryModel,
      scene
    );
    // 渲染
    threeDimensionalRender({
      scene,
      camera,
      renderer,
      orbitController,
      model,
    });
  });

  return (
    <div
      id="three-dimensional-model-container"
      className={styles.threeDimensionalContainer}
    />
  );
};

export default React.memo(ThreeDimensionalModel);
