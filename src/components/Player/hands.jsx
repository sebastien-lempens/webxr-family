import { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { useGamepad } from "../../hooks/useGamepad";
function LeftHand() {
  const { nodes, animations } = useGLTF("hand-left.gltf");
  const skinnedMesh = nodes.leftHand_2;
  const bonesMesh = nodes.leftHandBones;
  const { controllers } = useXR();
  const { 0: leftController } = controllers;
  const { ref, actions } = useAnimations(animations);
  const { gamepadTriggerLeft, gamepadUpdate } = useGamepad();

  useEffect(() => {
    actions["animation_0"].reset().play().paused = true;
    leftController.grip.add(ref.current);
    gamepadUpdate();
  }, []);

  useFrame((state, delta) => {
    if (gamepadTriggerLeft === null) return;
    actions["animation_0"].time = actions["animation_0"].getClip().duration * gamepadTriggerLeft.value;
  });
  return (
    <group ref={ref} rotation={[-0.6, 0, Math.PI / 4]}>
      <primitive object={bonesMesh} />
      <skinnedMesh geometry={skinnedMesh.geometry} skeleton={skinnedMesh.skeleton}>
        <meshStandardMaterial skinning />
      </skinnedMesh>
    </group>
  );
}
function RightHand() {
  const { nodes, animations } = useGLTF("hand-right.gltf");
  const skinnedMesh = nodes.leftHand_2;
  const bonesMesh = nodes.leftHandBones;
  const { controllers } = useXR();
  const { 1: rightController } = controllers;
  const { ref, actions } = useAnimations(animations);
  const { gamepadTriggerRight, gamepadUpdate } = useGamepad();

  useEffect(() => {
    actions["animation_0"].reset().play().paused = true;
    ref.current.scale.x *= -1;
    rightController.grip.add(ref.current);
    gamepadUpdate();
  }, []);

  useFrame((state, delta) => {
    if (gamepadTriggerRight === null) return;
    actions["animation_0"].time = actions["animation_0"].getClip().duration * gamepadTriggerRight.value;
  });
  return (
    <group ref={ref} rotation={[-0.6, 0, -Math.PI / 4]}>
      <primitive object={bonesMesh} />
      <skinnedMesh geometry={skinnedMesh.geometry} skeleton={skinnedMesh.skeleton}>
        <meshStandardMaterial skinning />
      </skinnedMesh>
    </group>
  );
}
function Hands() {
  return (
    <>
      <LeftHand />
      <RightHand />
    </>
  );
}

export { Hands };
