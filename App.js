import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { AR } from "expo";
import { GraphicsView } from "expo-graphics";
import { Renderer, THREE } from "expo-three";
import { BackgroundTexture, Camera } from "expo-three-ar";

// import * as ThreeAR from "expo-three-ar";
// import ExpoTHREE, { AR as ThreeAR, THREE } from "expo-three";

let renderer, scene, camera;

export default function App() {
  if (Platform.OS !== "ios") return null;

  const onContextCreate = async ({ gl, pixelRatio, width, height }) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Hr);

    // **** THREE.js elements -> renderer | scene | camera ****

    renderer = new Renderer({ gl, pixelRatio, width, height });

    scene = new THREE.Scene();
    scene.background = new BackgroundTexture(renderer);

    camera = new Camera(width, height, 0.01, 1000);

    // **** Object Creation -> we'll add to scene later ****

    // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    // Simple color material
    const material = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
    });

    // **** Append Object and Scene ****

    //Combine our geometry and material
    const cube = new THREE.Mesh(geometry, material);
    // Place the box 0.4 meters in front of us.
    cube.position.z = -0.4;
    // Add the cube to the scene
    scene.add(cube);
    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    scene.add(new THREE.AmbientLight(0xffffff));
  };

  const onResize = ({ scale, width, height }) => {
    camera.aspect = width / height;
    camera.updateProjectMatrix();

    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
  };

  const onRender = (delta) => {
    // if (mesh) {
    //   mesh.update(delta);
    // }

    renderer.render(scene, camera);
  };

  return (
    <View style={{ flex: 1 }}>
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
        onRender={onRender}
        onResize={onResize}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
      />
    </View>
  );
}
